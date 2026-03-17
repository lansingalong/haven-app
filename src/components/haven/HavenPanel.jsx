import { useState, useRef, useEffect, useCallback } from 'react'
import CloseDialog from './CloseDialog'
import CapabilitiesView from './CapabilitiesView'

// Quill/MUI design tokens
const MUI = {
  primary: '#1976d2',
  primaryLight: '#42a5f5',
  primaryDark: '#1565c0',
  primaryBg: 'rgba(25,118,210,0.08)',
  textPrimary: 'rgba(0,0,0,0.87)',
  textSecondary: 'rgba(0,0,0,0.60)',
  textDisabled: 'rgba(0,0,0,0.38)',
  divider: 'rgba(0,0,0,0.12)',
  bgDefault: '#ffffff',
  bgPaper: '#ffffff',
  bgSubtle: '#f5f5f5',
  hoverBg: 'rgba(0,0,0,0.04)',
  selectedBg: 'rgba(25,118,210,0.08)',
  elevation1: '0px 2px 1px -1px rgba(0,0,0,0.20), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
  elevation3: '0px 3px 3px -2px rgba(0,0,0,0.20), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)',
  elevation8: '0px 5px 5px -3px rgba(0,0,0,0.20), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
  borderRadius: '4px',
  font: "'Roboto', 'Helvetica', 'Arial', sans-serif",
}

const PROMPTS = [
  "What is on the member's medication list?",
  'What services is the member eligible for?',
  'When is the best time to contact the member?',
  "When does the member's eligibility end?",
]

export default function HavenPanel({ member, onClose, initialPos }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [showCloseDialog, setShowCloseDialog] = useState(false)
  const [showCapabilities, setShowCapabilities] = useState(false)

  const getPanelSize = () => ({
    w: Math.min(400, window.innerWidth - 16),
    h: Math.min(620, window.innerHeight - 80),
  })
  const [panelSize, setPanelSize] = useState(getPanelSize)
  const panelSizeRef = useRef(getPanelSize())
  // null = CSS right/bottom anchor; {x,y} = user has dragged it
  const [pos, setPos] = useState(null)
  const panelRef = useRef(null)
  const dragging = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const chatEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const onMouseDown = useCallback((e) => {
    dragging.current = true
    const rect = panelRef.current?.getBoundingClientRect()
    const curX = rect ? rect.left : (window.innerWidth - panelSizeRef.current.w - 4)
    const curY = rect ? rect.top : Math.max(4, window.innerHeight - panelSizeRef.current.h - 76)
    dragOffset.current = { x: e.clientX - curX, y: e.clientY - curY }
    setPos(p => p ?? { x: curX, y: curY })
    e.preventDefault()
  }, [])

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return
      const { w, h } = panelSizeRef.current
      setPos({
        x: Math.max(0, Math.min(window.innerWidth - w, e.clientX - dragOffset.current.x)),
        y: Math.max(0, Math.min(window.innerHeight - h, e.clientY - dragOffset.current.y)),
      })
    }
    const onUp = () => { dragging.current = false }
    const onResize = () => {
      const s = getPanelSize()
      panelSizeRef.current = s
      setPanelSize(s)
      setPos(null) // snap back to CSS right/bottom anchor
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const handleClose = () => {
    if (messages.length > 0) setShowCloseDialog(true)
    else onClose()
  }

  const sendMessage = async (text) => {
    if (!text.trim() || isStreaming) return
    const userMsg = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setIsStreaming(true)
    setMessages(prev => [...prev, { role: 'assistant', content: '', streaming: true }])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, member }),
      })
      if (!response.ok) throw new Error('Network error')
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accum = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        for (const line of decoder.decode(value).split('\n')) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.type === 'delta') {
                accum += data.text
                setMessages(prev => {
                  const u = [...prev]
                  u[u.length - 1] = { role: 'assistant', content: accum, streaming: true }
                  return u
                })
              }
            } catch {}
          }
        }
      }
      setMessages(prev => {
        const u = [...prev]
        u[u.length - 1] = { role: 'assistant', content: accum, streaming: false }
        return u
      })
    } catch {
      setMessages(prev => {
        const u = [...prev]
        u[u.length - 1] = { role: 'assistant', content: "Couldn't connect to the AI service. Please check the server is running.", streaming: false, error: true }
        return u
      })
    } finally {
      setIsStreaming(false)
    }
  }

  return (
    <>
      <div
        ref={panelRef}
        className="fixed z-50 flex flex-col overflow-hidden select-none"
        style={{
          ...(pos ? { left: pos.x, top: pos.y } : { right: 4, bottom: 76 }),
          width: panelSize.w,
          height: panelSize.h,
          background: MUI.bgPaper,
          boxShadow: MUI.elevation8,
          borderRadius: '8px',
          fontFamily: MUI.font,
        }}
      >
        {/* macOS title bar */}
        <div
          onMouseDown={onMouseDown}
          className="flex-shrink-0 flex items-center px-3 cursor-grab active:cursor-grabbing relative"
          style={{
            height: 36,
            background: MUI.bgSubtle,
            borderBottom: `1px solid ${MUI.divider}`,
          }}
        >
          <div className="flex gap-1.5">
            <div onClick={handleClose} className="w-3 h-3 rounded-full cursor-pointer hover:brightness-90" style={{ background: '#ED6A5E' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#F4BF4F' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#61C553' }} />
          </div>
          <span
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
            style={{ fontSize: '0.875rem', fontWeight: 500, color: MUI.textPrimary, letterSpacing: '0.0075em' }}
          >
            Haven
          </span>
        </div>

        {/* Member card — MUI Paper / Card style */}
        <div
          className="flex-shrink-0 px-4 py-3"
          style={{ borderBottom: `1px solid ${MUI.divider}` }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill={MUI.primary}>
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
              <span style={{ fontSize: '1.25rem', fontWeight: 500, color: MUI.textPrimary, letterSpacing: '0.0075em' }}>
                {member.havensName}
              </span>
            </div>
            <button
              onMouseDown={e => e.stopPropagation()}
              className="rounded-full flex items-center justify-center transition-colors"
              style={{ width: 32, height: 32, color: MUI.textSecondary }}
              onMouseEnter={e => e.currentTarget.style.background = MUI.hoverBg}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Preferred Phone Number', value: member.preferredPhone },
              { label: 'Member ID', value: member.havensMemberId },
              { label: 'Primary Care Provider', value: member.primaryCareProvider },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: '0.75rem', color: MUI.textSecondary, lineHeight: 1.4, marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: MUI.textPrimary }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div
          className="flex-1 overflow-y-auto flex flex-col px-3 py-3"
          style={{ background: '#F0FBFF' }}
        >
          {messages.length === 0
            ? showCapabilities
              ? <CapabilitiesView onBack={() => setShowCapabilities(false)} />
              : <WelcomeView onPrompt={sendMessage} />
            : <>
                {messages.map((msg, i) => <MessageBubble key={i} message={msg} />)}
                <div ref={chatEndRef} />
              </>
          }
        </div>

        {/* Input — MUI OutlinedInput style */}
        <div
          className="flex-shrink-0 px-3 pt-2 pb-2"
          style={{ background: MUI.bgPaper, borderTop: `1px solid ${MUI.divider}` }}
        >
          <MuiInput
            inputRef={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }}
            onMouseDown={e => e.stopPropagation()}
            onSend={() => sendMessage(input)}
            disabled={isStreaming}
            canSend={!!input.trim() && !isStreaming}
          />
          <p style={{ fontSize: '0.75rem', color: MUI.textSecondary, marginTop: 6, lineHeight: 1.4 }}>
            Check your responses for accuracy.{' '}
            <button
              onMouseDown={e => e.stopPropagation()}
              onClick={() => { setMessages([]); setShowCapabilities(true) }}
              style={{ color: MUI.primary, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontFamily: MUI.font, fontSize: '0.75rem' }}
            >
              What this assistant can and cannot do
            </button>
          </p>
        </div>
      </div>

      {showCloseDialog && (
        <CloseDialog
          onCancel={() => setShowCloseDialog(false)}
          onExit={() => { setShowCloseDialog(false); onClose() }}
        />
      )}
    </>
  )
}

function MuiInput({ inputRef, value, onChange, onKeyDown, onMouseDown, onSend, disabled, canSend }) {
  const [focused, setFocused] = useState(false)
  return (
    <div
      className="flex items-center gap-2 rounded px-3"
      style={{
        border: `1px solid ${focused ? MUI.primary : 'rgba(0,0,0,0.23)'}`,
        boxShadow: focused ? `0 0 0 2px ${MUI.primaryBg}` : 'none',
        background: MUI.bgPaper,
        borderRadius: MUI.borderRadius,
        height: 48,
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
    >
      <AiSparkle active={focused || !!value} />
      <input
        ref={inputRef}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onMouseDown={onMouseDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        placeholder="Ask Haven"
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontFamily: MUI.font,
          fontSize: '1rem',
          color: MUI.textPrimary,
          caretColor: MUI.primary,
        }}
      />
      <button
        onMouseDown={e => e.stopPropagation()}
        onClick={onSend}
        disabled={!canSend}
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: 'none',
          background: canSend ? MUI.primary : 'transparent',
          cursor: canSend ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.2s',
          flexShrink: 0,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill={canSend ? '#fff' : MUI.textDisabled}>
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
      </button>
    </div>
  )
}

function WelcomeView({ onPrompt }) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="flex flex-col justify-end flex-1 pb-1">
      {!menuOpen && (
        <>
          <p style={{ fontSize: '2.125rem', fontWeight: 400, color: MUI.textPrimary, lineHeight: 1.235, marginBottom: 8 }}>
            Welcome
          </p>
          <p style={{ fontSize: '0.875rem', color: MUI.textSecondary, marginBottom: 16, lineHeight: 1.5 }}>
            Pick a prompt or ask your own question
          </p>
        </>
      )}

      {/* "Get member details" — MUI Chip style */}
      {!menuOpen && (
        <button
          onClick={() => setMenuOpen(true)}
          className="flex items-center gap-2 self-start transition-colors"
          style={{
            background: MUI.bgPaper,
            border: `1px solid ${MUI.divider}`,
            borderRadius: 16,
            padding: '6px 12px 6px 6px',
            cursor: 'pointer',
            fontFamily: MUI.font,
          }}
          onMouseEnter={e => e.currentTarget.style.background = MUI.hoverBg}
          onMouseLeave={e => e.currentTarget.style.background = MUI.bgPaper}
        >
          <div
            className="rounded-full flex items-center justify-center"
            style={{ width: 24, height: 24, background: MUI.bgSubtle }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={MUI.textSecondary}>
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </div>
          <span style={{ fontSize: '0.8125rem', fontWeight: 400, color: MUI.textPrimary }}>
            Get member details
          </span>
        </button>
      )}

      {/* Animated prompt list — MUI List style */}
      {menuOpen && (
        <div
          className="rounded overflow-hidden"
          style={{ background: MUI.bgPaper, boxShadow: MUI.elevation3, border: `1px solid ${MUI.divider}` }}
        >
          {PROMPTS.map((prompt, i) => (
            <button
              key={prompt}
              onClick={() => onPrompt(prompt)}
              className="w-full text-left block transition-colors"
              style={{
                padding: '12px 16px',
                fontFamily: MUI.font,
                fontSize: '0.875rem',
                color: MUI.textPrimary,
                background: 'transparent',
                border: 'none',
                borderBottom: i < PROMPTS.length - 1 ? `1px solid ${MUI.divider}` : 'none',
                cursor: 'pointer',
                animation: 'slideInPrompt 0.18s ease forwards',
                animationDelay: `${i * 55}ms`,
                opacity: 0,
              }}
              onMouseEnter={e => e.currentTarget.style.background = MUI.hoverBg}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ThinkingDots() {
  return (
    <div style={{ display: 'flex', gap: 4, padding: '6px 2px', alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: MUI.textDisabled,
            animation: 'thinkingDot 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  )
}

function MessageBubble({ message }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  if (message.role === 'user') {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <div
          style={{
            background: MUI.primary,
            borderRadius: '18px 18px 4px 18px',
            padding: '8px 14px',
            maxWidth: '82%',
            fontSize: '0.875rem',
            color: '#fff',
            fontFamily: MUI.font,
            lineHeight: 1.5,
          }}
        >
          {message.content}
        </div>
      </div>
    )
  }

  // Assistant message
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'flex-start' }}>
      {/* Haven avatar */}
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        <svg width="14" height="13" viewBox="0 0 25 22" fill="none">
          <path d="M16.5 0L18.2 6.3L25 8L18.2 9.7L16.5 16L14.8 9.7L8 8L14.8 6.3L16.5 0Z" fill="white"/>
          <path d="M6 12L7 15.5L10.5 16.5L7 17.5L6 21L5 17.5L1.5 16.5L5 15.5L6 12Z" fill="rgba(255,255,255,0.7)"/>
        </svg>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Response — no bubble, plain text */}
        <div
          style={{
            padding: message.streaming && !message.content ? '4px 2px' : '2px 0',
            fontSize: '0.875rem',
            color: MUI.textPrimary,
            fontFamily: MUI.font,
            lineHeight: 1.65,
          }}
        >
          {message.streaming && !message.content
            ? <ThinkingDots />
            : (
              <div className={message.streaming ? 'streaming-cursor' : ''}>
                <FormattedResponse text={message.content} />
                {message.error && <span style={{ color: '#d32f2f', fontSize: '0.8125rem' }}> (Connection error)</span>}
              </div>
            )
          }
        </div>

        {/* Action row */}
        {!message.streaming && message.content && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 4, paddingLeft: 2 }}>
            <button
              title={copied ? 'Copied!' : 'Copy'}
              onClick={handleCopy}
              style={{ color: copied ? MUI.primary : MUI.textDisabled, background: 'none', border: 'none', cursor: 'pointer', padding: '3px 5px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 3, fontFamily: MUI.font, fontSize: '0.6875rem', transition: 'color 0.15s' }}
              onMouseEnter={e => { if (!copied) e.currentTarget.style.color = MUI.textSecondary }}
              onMouseLeave={e => { if (!copied) e.currentTarget.style.color = MUI.textDisabled }}
            >
              {copied
                ? <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                : <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
              }
              {copied ? 'Copied' : 'Copy'}
            </button>
            <div style={{ width: 1, height: 10, background: MUI.divider }} />
            {[
              { title: 'Helpful', d: 'M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z' },
              { title: 'Not helpful', d: 'M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z' },
            ].map(({ title, d }) => (
              <button
                key={title}
                title={title}
                style={{ color: MUI.textDisabled, background: 'none', border: 'none', cursor: 'pointer', padding: 3, borderRadius: 4, display: 'flex' }}
                onMouseEnter={e => { e.currentTarget.style.color = MUI.textSecondary }}
                onMouseLeave={e => { e.currentTarget.style.color = MUI.textDisabled }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d={d}/></svg>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Maps section IDs to keywords that might appear in citation definitions
const SECTION_KEYWORDS = {
  'member-personal': ['personal detail', 'member detail', 'demographic', 'name', 'gender', 'dob', 'date of birth', 'member id', 'pronouns', 'orientation', 'identity', 'clinical record', 'social history', 'member profile'],
  'member-phone': ['phone', 'contact', 'call', 'fax', 'telephone', 'preferred time', 'preference', 'reach', 'outreach', 'member prefer', 'contact prefer'],
  'member-languages': ['language', 'communication', 'spoken', 'written', 'interpreter', 'impairment', 'braille', 'deaf', 'hearing', 'visual', 'spanish', 'english', 'large font', 'accessibility'],
  'member-address': ['address', 'city', 'state', 'zip', 'county', 'location', 'postal'],
  'member-medical-ids': ['medical id', 'insurance', 'policy', 'medicaid', 'medicare', 'eligibility', 'coverage', 'enroll', 'secondary ins', 'primary ins'],
}

// Parse [n] Description lines at the bottom of a response into a { num: sectionId } map
function parseCitationMap(text) {
  const map = {}
  const citLineRe = /^\[(\d+)\]\s+(.+)$/
  for (const line of text.split('\n')) {
    const m = line.trim().match(citLineRe)
    if (!m) continue
    const num = m[1]
    const desc = m[2].toLowerCase()
    for (const [sectionId, keywords] of Object.entries(SECTION_KEYWORDS)) {
      if (keywords.some(k => desc.includes(k))) {
        map[num] = sectionId
        break
      }
    }
  }
  return map
}

function FormattedResponse({ text }) {
  if (!text) return null
  const citMap = parseCitationMap(text)
  const elements = []
  let key = 0
  for (const line of text.split('\n')) {
    if (!line.trim()) { elements.push(<div key={key++} style={{ height: 6 }} />); continue }
    if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(<p key={key++} style={{ fontWeight: 500, color: MUI.textPrimary, fontSize: '0.875rem', margin: 0 }}>{line.replace(/\*\*/g, '')}</p>)
    } else if (line.includes('**')) {
      const parts = line.split('**')
      elements.push(<p key={key++} style={{ fontSize: '0.875rem', margin: 0 }}>{parts.map((p, i) => i % 2 === 1 ? <strong key={i}>{p}</strong> : p)}</p>)
    } else if (line.startsWith('- ') || line.startsWith('• ')) {
      elements.push(
        <div key={key++} style={{ display: 'flex', gap: 8, fontSize: '0.875rem' }}>
          <span style={{ color: MUI.textSecondary, flexShrink: 0 }}>•</span>
          <span>{renderCitations(line.slice(2), citMap)}</span>
        </div>
      )
    } else {
      elements.push(<p key={key++} style={{ fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>{renderCitations(line, citMap)}</p>)
    }
  }
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>{elements}</div>
}

function renderCitations(text, citMap = {}) {
  return text.split(/(\[\d+\])/g).map((part, i) => {
    if (!/^\[\d+\]$/.test(part)) return part
    const num = part.slice(1, -1)
    const sectionId = citMap[num]
    const label = sectionId
      ? sectionId.replace('member-', '').replace(/-/g, ' ')
      : null
    return (
      <sup key={i}>
        <a
          href="#"
          onClick={e => {
            e.preventDefault()
            if (sectionId) {
              document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          }}
          title={label ? `View ${label}` : undefined}
          style={{
            color: MUI.primary,
            fontSize: '0.6875rem',
            cursor: sectionId ? 'pointer' : 'default',
            textDecoration: sectionId ? 'underline' : 'none',
          }}
        >
          {part}
        </a>
      </sup>
    )
  })
}

function AiSparkle({ active }) {
  const color = active ? '#04A1E9' : MUI.textDisabled
  return (
    <svg width="20" height="20" viewBox="0 0 25 22" fill="none" style={{ flexShrink: 0 }}>
      <path d="M16.5 0L18.2 6.3L25 8L18.2 9.7L16.5 16L14.8 9.7L8 8L14.8 6.3L16.5 0Z" fill={color}/>
      <path d="M6 12L7 15.5L10.5 16.5L7 17.5L6 21L5 17.5L1.5 16.5L5 15.5L6 12Z" fill={active ? '#137AA3' : MUI.textDisabled}/>
      <path d="M22 0L22.7 2.3L25 3L22.7 3.7L22 6L21.3 3.7L19 3L21.3 2.3L22 0Z" fill={active ? '#137AA3' : MUI.textDisabled}/>
    </svg>
  )
}
