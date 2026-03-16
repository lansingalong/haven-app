import express from 'express'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: join(__dirname, '../.env') })

const app = express()
app.use(cors())
app.use(express.json())

const API_KEY = process.env.ANTHROPIC_API_KEY || ''
const USE_MOCK = !API_KEY || API_KEY === 'your_anthropic_api_key_here'

const client = USE_MOCK ? null : new Anthropic({ apiKey: API_KEY })

const SYSTEM_PROMPT = `You are Haven, an AI assistant embedded in the HealthEdge healthcare management platform. You help care coordinators quickly access and understand member information.

You are currently viewing the record for the following member:
- Name: {memberName}
- Member ID: {memberId}
- Date of Birth: {dob}
- Preferred Phone: {phone}
- Primary Care Provider: {pcp}

MEMBER CONTEXT (simulated data for demo):
- Henry Tom Garcia has been diagnosed with Type 2 diabetes (8 months ago)
- Prescribed Metformin 1000mg twice daily
- A1C elevated at 8.4%
- Only filled prescription twice in 6 months (poor medication adherence)
- Works as a restaurant manager with irregular, high-stress hours
- Flagged for care management: new diabetes diagnosis with poor engagement
- Missed follow-up appointments
- Last ER visit: April 10, 2025 (hospital visit for blood sugar management)
- Latest PCP visit: April 18, 2025
- Primary Insurance: Medicaid
- Eligibility end date: December 31, 2026
- Care gaps: Annual eye exam, diabetes education program
- Preferred contact time: M-F 12pm-1pm
- Communication impairments: Visually Impaired, needs Large Font materials
- Speaks English primarily, writes in Spanish

INSTRUCTIONS:
- Be concise and clinically relevant. Format responses clearly.
- Use bullet points for lists, bold for section headers.
- Include numbered citations like [1] when referencing specific data points.
- Add citation links at the bottom: [1] Source description
- Do not make up medical information beyond what's provided.
- Focus on actionable insights for the care coordinator.
- Keep responses focused and scannable.`

// ─── Smart demo response generator ───────────────────────────────────────────

const HENRY = {
  name: 'Henry Tom Garcia', age: 24, dob: '01/01/2001',
  phone: '909-851-3064', memberId: 'AH0000007', havenId: 'AH00000009',
  insurance: 'Medicaid', eligibilityEnd: 'December 31, 2026',
  pcp: 'Ambetter', job: 'restaurant manager',
  diagnoses: ['Type 2 Diabetes (diagnosed ~8 months ago)'],
  medications: [{ name: 'Metformin', dose: '1000mg', frequency: 'twice daily', adherence: 'only 2 fills in past 6 months' }],
  labs: [{ name: 'A1C', value: '8.4%', flag: 'elevated', goal: '<7.0%' }],
  careGaps: ['Annual diabetic eye exam (overdue)', 'Diabetes self-management education (not enrolled)'],
  visits: [
    { date: 'April 10, 2025', type: 'Emergency', reason: 'blood sugar management' },
    { date: 'April 18, 2025', type: 'PCP', provider: 'Ambetter' },
  ],
  contactPref: 'Monday–Friday, 12:00 PM – 1:00 PM',
  commImpairments: ['Visually impaired — large font materials required', 'English spoken; prefers written materials in Spanish'],
  flags: ['New diabetes diagnosis with poor engagement', 'Missed follow-up appointments', 'Poor medication adherence'],
}

function classify(q) {
  const t = q.toLowerCase()
  if (/med(ication|s)?|metformin|prescription|drug|pharmacy|pill|\brx\b/.test(t)) return 'medication'
  if (/adher|complian|refill|fill(ed|s)?|pickup|taking|miss(ed|ing)?/.test(t)) return 'adherence'
  if (/a1c|hba1c|lab|result|test|blood sugar|glucose/.test(t)) return 'labs'
  if (/care gap|gap|overdue|preventive|educat|enroll|missing care/.test(t)) return 'caregaps'
  if (/contact|reach|call|best time|when to|phone|schedul/.test(t)) return 'contact'
  if (/eligib|coverage|insur|medicaid|expire|renew|policy/.test(t)) return 'eligibility'
  if (/visit|emergency|\ber\b|hospital|pcp|appointment|seen by/.test(t)) return 'visits'
  if (/diagnos|condition|diabetes|illness|disease/.test(t)) return 'diagnosis'
  if (/service|benefit|program|care manag/.test(t)) return 'services'
  if (/communi|language|speak|spanish|english|impair|vision|visual/.test(t)) return 'communication'
  if (/flag|alert|concern|risk|issue|problem|warn/.test(t)) return 'flags'
  if (/summar|overview|tell me|who is|background|profile|doing|status|update|overall/.test(t)) return 'summary'
  if (/\bid\b|dob|\bage\b|birth|phone|number|identif|demographic/.test(t)) return 'demographics'
  return 'general'
}

function buildResponse(intent, question) {
  switch (intent) {
    case 'medication':
      return `**Current Medications**

- **Metformin 1000mg** — taken twice daily [1]
  - Prescribed ~8 months ago following Type 2 diabetes diagnosis
  - Class: Biguanide (first-line diabetes medication)

**Adherence Status** ⚠️
Henry has filled this prescription only **2 times in the past 6 months**. This represents significant under-adherence and is a primary care management concern. [2]

**Clinical Impact**
Poor adherence likely contributes to his elevated A1C of 8.4% (target <7.0%). The irregular fill pattern may reflect his demanding schedule as a restaurant manager.

**Recommended Action**
Consider a targeted medication adherence conversation. Best outreach window: M-F 12:00–1:00 PM.

---
[1] Pharmacy records
[2] Medication fill history — care management flag`

    case 'adherence':
      return `**Medication Adherence — Henry Tom Garcia**

**Summary:** Poor adherence [1]

- Prescription: Metformin 1000mg twice daily
- Expected fills (6 months): ~6 refills
- Actual fills: **2 refills** (33% fill rate) [1]
- Last fill date: not on record

**Likely Barriers**
- Irregular work schedule (restaurant manager) [2]
- High-stress, long hours — may forget or deprioritize
- No documented pharmacy access issues

**Clinical Concern**
A1C at 8.4% — elevated above 7.0% goal — likely partly due to inconsistent medication use. [3]

**Suggested Intervention**
- Motivational interview during next outreach
- Explore pharmacy delivery options
- Set medication reminders

---
[1] Pharmacy fill records
[2] Social determinants — occupational history
[3] Lab results`

    case 'labs':
      return `**Lab Results — Henry Tom Garcia**

| Test | Result | Normal Range | Status |
|------|--------|--------------|--------|
| HbA1c (A1C) | **8.4%** | <7.0% (diabetic target) | 🔴 Elevated [1] |

**Interpretation**
An A1C of 8.4% indicates Henry's blood sugar has been poorly controlled over the past 2–3 months. The clinical target for most diabetic patients is below 7.0%.

**Contributing Factors**
- Metformin adherence: only 2 fills in 6 months [2]
- High-stress occupation
- ER visit for blood sugar management (April 10, 2025) [3]

**Recommended Follow-Up**
Repeat A1C in 3 months following medication adherence intervention. Consider referral to diabetes educator.

---
[1] Clinical lab results
[2] Pharmacy fill records
[3] ER visit summary`

    case 'caregaps':
      return `**Open Care Gaps — Henry Tom Garcia**

1. **Annual Diabetic Eye Exam** — overdue [1]
   - Diabetic retinopathy screening recommended annually
   - No exam on file for current year

2. **Diabetes Self-Management Education (DSME)** — not enrolled [1]
   - Evidence-based program for newly diagnosed patients
   - Especially relevant given poor medication adherence

**Why These Matter**
- Eye exams can detect early retinopathy before vision loss occurs
- DSME programs significantly improve A1C and self-care behaviors

**Barriers to Address**
- Visual impairment — confirm large-print materials are available [2]
- Work schedule — evening or weekend program options may be needed

**Suggested Outreach**
Contact M-F 12:00–1:00 PM to discuss scheduling and program options.

---
[1] Care gap tracker
[2] Communication impairments record`

    case 'contact':
      return `**Contact Preferences — Henry Tom Garcia**

**Preferred Window:** Monday – Friday, 12:00 PM – 1:00 PM [1]

**Phone:** 909-851-3064

**Why this window?**
Henry works as a restaurant manager with irregular evening and weekend hours. The midday lunch break is the most reliable time to reach him. [2]

**Communication Accommodations** ⚠️
- **Visually impaired** — all written materials must be in large font [3]
- **Language:** Speaks English; prefers written communication in Spanish [3]

**Best Practice**
1. Call during preferred window
2. Follow up in writing — use large font, Spanish where possible
3. Keep messages brief and action-oriented

---
[1] Member preferences
[2] Occupational/social history
[3] Communication impairments flag`

    case 'eligibility':
      return `**Eligibility & Coverage — Henry Tom Garcia**

| Field | Value |
|-------|-------|
| Insurance | Medicaid (Primary) [1] |
| Status | Active |
| Eligibility End | **December 31, 2026** [1] |
| Member ID | AH0000007 |
| Haven ID | AH00000009 |

**No immediate action required.** Coverage is active through end of 2026.

**Recommended:** Set a reminder in Q4 2026 to confirm renewal and assist with re-enrollment if needed.

**Note:** Medicaid eligibility is subject to annual redetermination. Henry's care coordinator should verify the renewal timeline closer to the expiration date.

---
[1] Eligibility system`

    case 'visits':
      return `**Recent Clinical Visits — Henry Tom Garcia**

| Date | Type | Details |
|------|------|---------|
| April 10, 2025 | **Emergency Room** | Blood sugar management [1] |
| April 18, 2025 | **PCP Visit** | Follow-up with Ambetter [2] |

**ER Visit Context**
The April 10 ER visit was likely related to poor blood glucose control — consistent with low medication adherence (2 fills in 6 months). This represents an avoidable utilization event.

**Follow-Up Status**
Henry did have a PCP follow-up 8 days after the ER visit. However, subsequent engagement has been limited.

**Missed Appointments**
Henry has a history of missed follow-up appointments. [3]

**Priority Action**
Schedule next PCP or diabetes educator visit and confirm with a reminder call during his contact window (M-F 12–1 PM).

---
[1] ER visit record — April 10, 2025
[2] PCP visit record — April 18, 2025
[3] Appointment history`

    case 'diagnosis':
      return `**Active Diagnoses — Henry Tom Garcia**

1. **Type 2 Diabetes Mellitus** — diagnosed ~8 months ago [1]
   - ICD-10: E11.x
   - Management status: **Poorly controlled** (A1C 8.4%)
   - Treatment: Metformin 1000mg BID (low adherence)

**Risk Factors**
- High-stress occupation (restaurant manager) [2]
- Irregular eating and sleep schedule
- Young age at diagnosis (24) — important for long-term management

**Complications to Monitor**
- Diabetic retinopathy — eye exam overdue [3]
- Neuropathy, nephropathy — standard monitoring recommended

**Engagement Level**
Currently flagged for poor care engagement: missed appointments, low medication adherence, not enrolled in diabetes education.

---
[1] Clinical record
[2] Social history
[3] Care gaps`

    case 'services':
      return `**Services & Programs — Henry Tom Garcia**

**Eligible & Not Yet Enrolled:**

1. **Diabetes Self-Management Education (DSME)** [1]
   - Status: Eligible, not enrolled
   - Goal: Improve self-care skills and A1C

2. **Care Management Program** [1]
   - Status: Flagged for enrollment
   - Priority: High — new diagnosis, poor engagement

3. **Diabetic Eye Exam (annual)** [2]
   - Status: Care gap — overdue

**Currently Active:**
- Medicaid coverage (active through Dec 31, 2026) [3]
- PCP relationship with Ambetter

**Communication Note**
Materials must be in large print; offer Spanish written option where available. [4]

---
[1] Care management system
[2] Preventive care tracker
[3] Eligibility system
[4] Communication preferences`

    case 'communication':
      return `**Communication Profile — Henry Tom Garcia**

**Language**
- Spoken: English (primary) [1]
- Written: Spanish (preferred) [1]

**Accessibility Needs** ⚠️
- Visually impaired — all materials must be in **large font** [1]
- Verify format before sending any written correspondence

**Preferred Contact**
- Phone: 909-851-3064
- Best time: M-F 12:00 PM – 1:00 PM [2]

**Outreach Best Practices**
1. Call during preferred window — avoid evenings/weekends
2. Confirm he can read materials before sending
3. Provide Spanish-language large-print handouts when possible
4. Use simple, jargon-free language

---
[1] Communication impairments and language record
[2] Member preferences`

    case 'flags':
      return `**Active Alerts & Flags — Henry Tom Garcia**

🔴 **Poor Medication Adherence**
Metformin: only 2 fills in 6 months (33% fill rate). Direct clinical risk. [1]

🔴 **Elevated A1C — 8.4%**
Above target of <7.0%. Indicates uncontrolled blood glucose. [2]

🟡 **Missed Follow-Up Appointments**
Pattern of no-shows following care recommendations. [3]

🟡 **New Diagnosis, Low Engagement**
Flagged for care management: Henry has not enrolled in diabetes education and has limited engagement since diagnosis. [3]

🔵 **Open Care Gaps**
- Annual diabetic eye exam (overdue)
- Diabetes education program (not enrolled) [4]

🔵 **ER Utilization**
One ER visit (April 10, 2025) likely avoidable with better diabetes management. [5]

---
[1] Pharmacy fill records
[2] Lab results
[3] Care management flags
[4] Care gap tracker
[5] Claims/utilization data`

    case 'demographics':
      return `**Member Demographics — Henry Tom Garcia**

| Field | Value |
|-------|-------|
| Full Name | Henry Tom Garcia |
| Date of Birth | 01/01/2001 |
| Age | 24 |
| Member ID | AH0000007 |
| Haven ID | AH00000009 |
| Phone | 909-851-3064 |
| Insurance | Medicaid |
| Primary Care | Ambetter |
| Eligibility End | December 31, 2026 |

**Occupation:** Restaurant manager [1]
**Language:** English (spoken), Spanish (written preference) [2]

---
[1] Social history
[2] Communication preferences`

    case 'summary':
      return `**Member Overview — Henry Tom Garcia**

Henry is a 24-year-old male enrolled in Medicaid, recently diagnosed with **Type 2 Diabetes** (~8 months ago). [1]

**Key Clinical Concerns**
- Metformin 1000mg BID prescribed — only **2 fills in 6 months** (poor adherence) [2]
- A1C: **8.4%** — above target of <7.0% [3]
- ER visit April 10, 2025 for blood sugar management [4]

**Engagement Status**
Flagged for poor care engagement. Missing follow-up appointments. Not enrolled in diabetes education. [5]

**Open Care Gaps**
- Annual diabetic eye exam (overdue)
- Diabetes self-management education

**Best Contact:** M-F 12:00–1:00 PM | 909-851-3064
**Communication:** Visually impaired; English spoken, Spanish written [6]

---
[1] Clinical record
[2] Pharmacy fill history
[3] Lab results
[4] ER visit record
[5] Care management flags
[6] Communication preferences`

    default:
      return `**Haven — Member Information**

I can help you find information about Henry Tom Garcia. Here's what I have available:

- **Medications & adherence** — Metformin, fill history
- **Lab results** — A1C and blood glucose
- **Care gaps** — overdue services and open recommendations
- **Contact preferences** — best time and communication needs
- **Clinical visits** — recent ER and PCP encounters
- **Eligibility & coverage** — Medicaid status
- **Active flags** — care management alerts

Try asking something like: *"What medications is Henry on?"* or *"When is the best time to contact him?"*

---
*Haven has access to clinical, pharmacy, eligibility, and care management data for this member.*`
  }
}

async function streamMock(text, res) {
  for (const char of text) {
    res.write(`data: ${JSON.stringify({ type: 'delta', text: char })}\n\n`)
    await new Promise(r => setTimeout(r, 6 + Math.random() * 10))
  }
}

// ─── Route ────────────────────────────────────────────────────────────────────

app.post('/api/chat', async (req, res) => {
  const { messages, member } = req.body

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages' })
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  if (USE_MOCK) {
    const lastUser = [...messages].reverse().find(m => m.role === 'user')
    const question = lastUser?.content || ''
    const intent = classify(question)
    const responseText = buildResponse(intent, question)
    await streamMock(responseText, res)
    res.write('data: {"type":"done"}\n\n')
    res.end()
    return
  }

  const systemPrompt = SYSTEM_PROMPT
    .replace('{memberName}', member?.name || 'Unknown')
    .replace('{memberId}', member?.id || 'Unknown')
    .replace('{dob}', member?.dob || 'Unknown')
    .replace('{phone}', member?.preferredPhone || 'Unknown')
    .replace('{pcp}', member?.primaryCareProvider || 'Unknown')

  try {
    const stream = client.messages.stream({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    })

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
        res.write(`data: ${JSON.stringify({ type: 'delta', text: event.delta.text })}\n\n`)
      }
    }

    res.write('data: {"type":"done"}\n\n')
    res.end()
  } catch (err) {
    console.error('Claude API error:', err.message)
    res.write(`data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`)
    res.end()
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Haven server running on http://localhost:${PORT} ${USE_MOCK ? '(demo mode)' : '(live Claude API)'}`)
})
