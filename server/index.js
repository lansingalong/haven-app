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

// ─── System prompts per member ────────────────────────────────────────────────

const HENRY_SYSTEM = `You are Haven, an AI assistant embedded in the HealthEdge healthcare management platform. You help care coordinators quickly access and understand member information.

You are currently viewing the record for Henry Tom Garcia (ID: AH0000007, DOB: 01/01/2001).

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

const LISA_SYSTEM = `You are Haven, an AI assistant embedded in the HealthEdge healthcare management platform. You help care coordinators quickly access and understand member information.

You are currently viewing the record for Lisa Marie Thompson (ID: AH0000042, DOB: 05/15/1978).

MEMBER CONTEXT (simulated data for demo):
- Lisa Marie Thompson, age 47, diagnosed with hypertension and hyperlipidemia (2 years ago)
- Prescribed Lisinopril 10mg daily (for hypertension) and Atorvastatin 40mg nightly (for cholesterol)
- Generally good medication adherence — fills both prescriptions regularly
- Most recent BP reading: 148/92 mmHg (above target of <130/80)
- LDL cholesterol: 118 mg/dL (above target of <100 mg/dL)
- Works as a high school teacher — weekday schedule, available after 4pm
- Primary Insurance: Medicare Advantage (BlueCross)
- Eligibility end date: December 31, 2026
- Care gaps: Annual wellness visit (overdue), Mammogram (overdue 14 months)
- Preferred contact time: Weekdays after 4:00 PM
- No communication impairments; English only
- Last PCP visit: January 8, 2025
- No ER visits in past year
- BMI: 28.4 (overweight)
- Referred to dietitian — appointment not yet scheduled
- Family history: Hypertension (mother), cardiac event (father at 62)

INSTRUCTIONS:
- Be concise and clinically relevant. Format responses clearly.
- Use bullet points for lists, bold for section headers.
- Include numbered citations like [1] when referencing specific data points.
- Add citation links at the bottom: [1] Source description
- Do not make up medical information beyond what's provided.
- Focus on actionable insights for the care coordinator.
- Keep responses focused and scannable.`

// ─── Mock response generator ──────────────────────────────────────────────────

function classify(q) {
  const t = q.toLowerCase()
  if (/med(ication|s)?|lisinopril|atorvastatin|metformin|prescription|drug|pharmacy|pill|\brx\b/.test(t)) return 'medication'
  if (/adher|complian|refill|fill(ed|s)?|pickup|taking|miss(ed|ing)?/.test(t)) return 'adherence'
  if (/a1c|hba1c|lab|result|test|blood|glucose|bp|blood pressure|ldl|cholesterol/.test(t)) return 'labs'
  if (/care gap|gap|overdue|preventive|educat|enroll|missing care|mammogram|wellness/.test(t)) return 'caregaps'
  if (/contact|reach|call|best time|when to|phone|schedul/.test(t)) return 'contact'
  if (/eligib|coverage|insur|medicaid|medicare|expire|renew|policy/.test(t)) return 'eligibility'
  if (/visit|emergency|\ber\b|hospital|pcp|appointment|seen by/.test(t)) return 'visits'
  if (/diagnos|condition|diabetes|hypertension|illness|disease|hyperlipid|cholesterol/.test(t)) return 'diagnosis'
  if (/service|benefit|program|care manag/.test(t)) return 'services'
  if (/communi|language|speak|spanish|english|impair|vision|visual/.test(t)) return 'communication'
  if (/flag|alert|concern|risk|issue|problem|warn/.test(t)) return 'flags'
  if (/summar|overview|tell me|who is|background|profile|doing|status|update|overall/.test(t)) return 'summary'
  if (/\bid\b|dob|\bage\b|birth|phone|number|identif|demographic/.test(t)) return 'demographics'
  return 'general'
}

function buildHenryResponse(intent) {
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
[2] Social history — occupational background
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
Repeat A1C in 3 months following medication adherence intervention.

---
[1] Clinical lab results
[2] Pharmacy fill records
[3] ER visit record`

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
[2] Social history — occupational background
[3] Communication impairments record`

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

---
[1] Eligibility system — insurance record`

    case 'visits':
      return `**Recent Clinical Visits — Henry Tom Garcia**

| Date | Type | Details |
|------|------|---------|
| April 10, 2025 | **Emergency Room** | Blood sugar management [1] |
| April 18, 2025 | **PCP Visit** | Follow-up with Ambetter [2] |

**ER Visit Context**
The April 10 ER visit was likely related to poor blood glucose control — consistent with low medication adherence (2 fills in 6 months). This represents an avoidable utilization event.

**Missed Appointments**
Henry has a history of missed follow-up appointments. [3]

**Priority Action**
Schedule next PCP or diabetes educator visit and confirm with a reminder call during his contact window (M-F 12–1 PM).

---
[1] ER visit record
[2] PCP visit record
[3] Care management flags`

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

---
[1] Clinical record — personal details
[2] Social history
[3] Care gap tracker`

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
- Medicare Advantage coverage (active through Dec 31, 2026) [3]
- PCP relationship with Ambetter

**Communication Note**
Materials must be in large print; offer Spanish written option where available. [4]

---
[1] Care management system
[2] Preventive care tracker
[3] Eligibility system — insurance record
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

---
[1] Communication impairments and language record
[2] Member preferences — phone numbers`

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
[2] Lab results — clinical record
[3] Care management flags
[4] Care gap tracker
[5] ER visit record`

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
[1] Social history — personal details
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
[1] Personal details — clinical record
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

function buildLisaResponse(intent) {
  switch (intent) {
    case 'medication':
      return `**Current Medications**

- **Lisinopril 10mg** — taken once daily (morning) [1]
  - Prescribed 2 years ago for hypertension
  - Class: ACE inhibitor

- **Atorvastatin 40mg** — taken once nightly [1]
  - Prescribed 2 years ago for hyperlipidemia
  - Class: Statin

**Adherence Status** ✅
Lisa fills both prescriptions consistently and on schedule. Medication adherence is not a current concern. [2]

**Clinical Note**
Despite good adherence, BP remains elevated at 148/92 (target <130/80) and LDL is 118 mg/dL (target <100). May warrant dose adjustment or lifestyle counseling.

**Recommended Action**
Discuss BP and LDL trends at next PCP visit. Confirm dietitian referral is followed up.

---
[1] Pharmacy records
[2] Medication fill history`

    case 'adherence':
      return `**Medication Adherence — Lisa Marie Thompson**

**Summary:** Good adherence ✅

- Lisinopril 10mg: fills consistently on schedule [1]
- Atorvastatin 40mg: fills consistently on schedule [1]
- No gaps in either medication over the past 12 months

**Clinical Note**
Good adherence is a positive engagement signal. However, BP (148/92) and LDL (118 mg/dL) remain above targets, suggesting medication dosing or lifestyle factors may need to be addressed. [2]

**Suggested Conversation**
- Acknowledge adherence — this is working well
- Discuss dietary changes (low-sodium, heart-healthy diet)
- Confirm dietitian referral is being followed up

---
[1] Pharmacy fill records
[2] Lab results — clinical record`

    case 'labs':
      return `**Lab Results — Lisa Marie Thompson**

| Test | Result | Target | Status |
|------|--------|--------|--------|
| Blood Pressure | **148/92 mmHg** | <130/80 mmHg | 🔴 Elevated [1] |
| LDL Cholesterol | **118 mg/dL** | <100 mg/dL | 🟡 Above target [1] |
| BMI | **28.4** | 18.5–24.9 | 🟡 Overweight [2] |

**Interpretation**
BP remains uncontrolled despite Lisinopril use. LDL is above target despite Atorvastatin. BMI in overweight range may be contributing to both conditions.

**Contributing Factors**
- Dietary habits — referral to dietitian in progress [3]
- Family history: hypertension (mother), cardiac event (father at 62) [2]

**Recommended Follow-Up**
Discuss potential Lisinopril dose adjustment or adding a second antihypertensive. Ensure dietitian appointment is scheduled.

---
[1] Clinical lab results
[2] Personal details — clinical record
[3] Referral tracker`

    case 'caregaps':
      return `**Open Care Gaps — Lisa Marie Thompson**

1. **Annual Wellness Visit** — overdue [1]
   - Last PCP visit: January 8, 2025 (14+ months ago)
   - Recommended annually for Medicare Advantage members

2. **Mammogram** — overdue 14 months [1]
   - Breast cancer screening recommended annually (ages 40–75)
   - No record of completed mammogram in past 14 months

**Why These Matter**
- Wellness visits allow comprehensive review of BP, labs, and medication management
- Mammograms are critical for early breast cancer detection

**Barriers to Consider**
- Work schedule — high school teacher, available after 4pm
- No documented transportation or communication barriers

**Suggested Outreach**
Contact Lisa on weekdays after 4:00 PM to schedule both the wellness visit and mammogram referral.

---
[1] Care gap tracker`

    case 'contact':
      return `**Contact Preferences — Lisa Marie Thompson**

**Preferred Window:** Weekdays after 4:00 PM [1]

**Phone:** 312-555-0189

**Why this window?**
Lisa works as a high school teacher with a fixed school-day schedule. She is typically available after school ends at approximately 4:00 PM. [2]

**Communication Profile**
- No communication impairments [3]
- Language: English only
- No accessibility accommodations needed

**Best Practice**
1. Call on weekdays between 4:00–6:00 PM
2. Leave a clear voicemail if no answer — she's responsive
3. Can receive standard written materials (no large font or language requirements)

---
[1] Member preferences — phone numbers
[2] Social history — personal details
[3] Communication preferences`

    case 'eligibility':
      return `**Eligibility & Coverage — Lisa Marie Thompson**

| Field | Value |
|-------|-------|
| Insurance | Medicare Advantage — BlueCross (Primary) [1] |
| Status | Active |
| Eligibility End | **December 31, 2026** [1] |
| Member ID | AH0000042 |
| Haven ID | AH00000044 |

**No immediate action required.** Coverage is active through end of 2026.

**Note:** Medicare Advantage members require annual wellness visits for full benefit utilization. Lisa's wellness visit is currently overdue.

---
[1] Eligibility system — insurance record`

    case 'visits':
      return `**Recent Clinical Visits — Lisa Marie Thompson**

| Date | Type | Details |
|------|------|---------|
| January 8, 2025 | **PCP Visit** | Routine follow-up with BlueCross [1] |
| No ER visits in past year | — | — |

**Visit Context**
Last PCP visit was over 14 months ago. Annual wellness visit is now overdue for her Medicare Advantage plan.

**Key Discussion Points at Last Visit**
- BP management reviewed
- Atorvastatin and Lisinopril continued
- Dietitian referral initiated — appointment not yet scheduled

**Priority Action**
Outreach to schedule overdue annual wellness visit. Confirm dietitian appointment status.

---
[1] PCP visit record`

    case 'diagnosis':
      return `**Active Diagnoses — Lisa Marie Thompson**

1. **Hypertension (Essential)** — diagnosed ~2 years ago [1]
   - ICD-10: I10
   - Current BP: 148/92 mmHg (target <130/80)
   - Treatment: Lisinopril 10mg daily (good adherence, not at goal)

2. **Hyperlipidemia** — diagnosed ~2 years ago [1]
   - ICD-10: E78.5
   - Current LDL: 118 mg/dL (target <100 mg/dL)
   - Treatment: Atorvastatin 40mg nightly (good adherence, not at goal)

**Risk Factors**
- BMI 28.4 (overweight) [2]
- Family history: hypertension (mother), cardiac event (father at 62) [1]
- Age 47 — approaching higher cardiovascular risk window

**Monitoring Priorities**
- BP reassessment at next visit
- Consider cardiology referral given family history

---
[1] Clinical record — personal details
[2] Lab results`

    case 'services':
      return `**Services & Programs — Lisa Marie Thompson**

**Eligible & Not Yet Completed:**

1. **Annual Wellness Visit** [1]
   - Status: Overdue — not completed in past 14 months
   - Covered by Medicare Advantage

2. **Mammogram Screening** [1]
   - Status: Care gap — overdue 14 months
   - Covered by Medicare Advantage

3. **Dietitian Consultation** [2]
   - Status: Referral initiated, appointment not yet scheduled
   - Goal: Support BP and cholesterol management through diet

**Currently Active:**
- Medicare Advantage coverage — BlueCross (active through Dec 31, 2026) [3]
- PCP relationship with BlueCross

---
[1] Care gap tracker
[2] Referral tracker
[3] Eligibility system — insurance record`

    case 'communication':
      return `**Communication Profile — Lisa Marie Thompson**

**Language**
- Spoken: English [1]
- Written: English [1]

**Accessibility Needs**
- No documented communication impairments [1]
- No accessibility accommodations required

**Preferred Contact**
- Phone: 312-555-0189
- Best time: Weekdays after 4:00 PM [2]

**Outreach Best Practices**
1. Call on weekdays after 4:00 PM (teacher — school day ends ~3:30 PM)
2. Standard written materials are fine — no large font or translation needed
3. Can be reached via voicemail if unavailable

---
[1] Communication preferences
[2] Member preferences — phone numbers`

    case 'flags':
      return `**Active Alerts & Flags — Lisa Marie Thompson**

🔴 **Uncontrolled Blood Pressure**
BP at 148/92 mmHg — above target of <130/80 despite Lisinopril. [1]

🟡 **Annual Wellness Visit Overdue**
No wellness visit in 14+ months. Required annually for Medicare Advantage. [2]

🟡 **Mammogram Overdue**
Breast cancer screening overdue by 14 months. [2]

🟡 **LDL Above Target**
LDL at 118 mg/dL — above goal of <100 mg/dL despite Atorvastatin use. [1]

🔵 **Dietitian Referral Pending**
Referral initiated at last PCP visit (Jan 8, 2025). Appointment not yet scheduled. [3]

🔵 **Family Cardiac History**
Father had cardiac event at 62 — increased cardiovascular risk. [4]

---
[1] Lab results — clinical record
[2] Care gap tracker
[3] Referral tracker
[4] Personal details — clinical record`

    case 'demographics':
      return `**Member Demographics — Lisa Marie Thompson**

| Field | Value |
|-------|-------|
| Full Name | Lisa Marie Thompson |
| Date of Birth | 05/15/1978 |
| Age | 47 |
| Member ID | AH0000042 |
| Haven ID | AH00000044 |
| Phone | 312-555-0189 |
| Insurance | Medicare Advantage (BlueCross) |
| Primary Care | BlueCross |
| Eligibility End | December 31, 2026 |

**Occupation:** High school teacher [1]
**Language:** English (spoken and written) [2]

---
[1] Personal details — social history
[2] Communication preferences`

    case 'summary':
      return `**Member Overview — Lisa Marie Thompson**

Lisa is a 47-year-old female enrolled in Medicare Advantage (BlueCross), managing **hypertension** and **hyperlipidemia** (both diagnosed ~2 years ago). [1]

**Key Clinical Concerns**
- BP: **148/92 mmHg** — above target of <130/80 despite medication [2]
- LDL: **118 mg/dL** — above target despite Atorvastatin use [2]
- BMI: 28.4 (overweight) — contributing factor [2]

**Engagement Status**
Good medication adherence ✅. However, overdue on annual wellness visit and mammogram. Dietitian referral pending follow-up. [3]

**Open Care Gaps**
- Annual wellness visit (overdue 14+ months)
- Mammogram (overdue 14 months)

**Best Contact:** Weekdays after 4:00 PM | 312-555-0189
**Communication:** No impairments; English only [4]

---
[1] Personal details — clinical record
[2] Lab results
[3] Care gap tracker
[4] Communication preferences`

    default:
      return `**Haven — Member Information**

I can help you find information about Lisa Marie Thompson. Here's what I have available:

- **Medications & adherence** — Lisinopril, Atorvastatin, fill history
- **Lab results** — Blood pressure, LDL cholesterol, BMI
- **Care gaps** — Wellness visit, mammogram, dietitian referral
- **Contact preferences** — best time and communication needs
- **Clinical visits** — PCP encounters
- **Eligibility & coverage** — Medicare Advantage status
- **Active flags** — care management alerts

Try asking something like: *"What are Lisa's open care gaps?"* or *"When is the best time to contact her?"*

---
*Haven has access to clinical, pharmacy, eligibility, and care management data for this member.*`
  }
}

function buildResponse(intent, memberId) {
  if (memberId === 'AH0000042') return buildLisaResponse(intent)
  return buildHenryResponse(intent)
}

async function streamMock(text, res) {
  for (const char of text) {
    res.write(`data: ${JSON.stringify({ type: 'delta', text: char })}\n\n`)
    await new Promise(r => setTimeout(r, 6 + Math.random() * 10))
  }
}

// ─── Serve built frontend in production ───────────────────────────────────────

const distPath = join(__dirname, '../dist')
app.use(express.static(distPath))

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
    const responseText = buildResponse(intent, member?.id)
    await streamMock(responseText, res)
    res.write('data: {"type":"done"}\n\n')
    res.end()
    return
  }

  const systemPrompt = member?.id === 'AH0000042' ? LISA_SYSTEM : HENRY_SYSTEM

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

// SPA fallback — serve index.html for all non-API routes
app.use((req, res) => {
  res.sendFile(join(distPath, 'index.html'))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Haven server running on http://localhost:${PORT} ${USE_MOCK ? '(demo mode)' : '(live Claude API)'}`)
})
