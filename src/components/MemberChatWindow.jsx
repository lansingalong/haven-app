import { useState, useRef, useEffect, useCallback } from 'react'

const INITIAL_MESSAGES = [
  {
    id: 1,
    type: 'member',
    text: 'Hi, I wanted to check in — is there anything I can support you with?',
    time: '12/3/2025 8:58 AM',
  },
  {
    id: 2,
    type: 'care_manager',
    sender: 'Nicholas F.',
    role: 'Care Manager',
    time: '12/3/2025 9:01 AM',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponotus_flavomarginatus_ant.jpg/320px-Camponotus_flavomarginatus_ant.jpg',
    imageAlt: 'Aspirin bottle',
    action: 'Take two as needed',
  },
  {
    id: 3,
    type: 'care_manager',
    sender: 'Nicholas F.',
    role: 'Care Manager',
    time: '12/3/2025 9:03 AM',
    text: 'Henry said their pain was much worse',
  },
]

export default function MemberChatWindow({ member, onClose, initialPos }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('All')
  const chatEndRef = useRef(null)

  const getPanelSize = () => ({
    w: Math.min(380, window.innerWidth - 16),
    h: Math.min(560, window.innerHeight - 80),
  })
  const [panelSize, setPanelSize] = useState(getPanelSize)
  const [pos, setPos] = useState(initialPos ?? { x: 100, y: 100 })
  const dragging = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const onMouseDown = useCallback((e) => {
    dragging.current = true
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
    e.preventDefault()
  }, [pos])

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return
      setPos({
        x: Math.max(0, Math.min(window.innerWidth - panelSize.w, e.clientX - dragOffset.current.x)),
        y: Math.max(0, Math.min(window.innerHeight - panelSize.h, e.clientY - dragOffset.current.y)),
      })
    }
    const onUp = () => { dragging.current = false }
    const onResize = () => {
      const { w, h } = getPanelSize()
      setPanelSize({ w, h })
      setPos({
        x: Math.max(4, window.innerWidth - 400 - w - 12),
        y: Math.max(4, window.innerHeight - h - 80),
      })
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

  const sendMessage = () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'care_manager',
      sender: 'You',
      role: 'Care Manager',
      time: new Date().toLocaleString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }),
      text: input.trim(),
    }])
    setInput('')
  }

  return (
    <div
      className="fixed z-50 flex flex-col bg-white rounded-xl overflow-hidden select-none"
      style={{
        left: pos.x,
        top: pos.y,
        width: panelSize.w,
        height: panelSize.h,
        boxShadow: '0 8px 40px rgba(0,0,0,0.20), 0 2px 10px rgba(0,0,0,0.10)',
      }}
    >
      {/* macOS title bar */}
      <div
        onMouseDown={onMouseDown}
        className="flex-shrink-0 flex items-center px-3 cursor-grab active:cursor-grabbing relative"
        style={{ height: 36, background: '#f5f5f5', borderBottom: '1px solid rgba(0,0,0,0.12)' }}
      >
        <div className="flex gap-1.5">
          <div onClick={onClose} className="w-3 h-3 rounded-full cursor-pointer hover:brightness-90" style={{ background: '#ED6A5E' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#F4BF4F' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#61C553' }} />
        </div>
        <span className="absolute left-1/2 -translate-x-1/2 pointer-events-none" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(0,0,0,0.87)', letterSpacing: '0.0075em' }}>
          {member.name}
        </span>
      </div>


{/* Member header */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 py-2.5 bg-[#1e3a6e] text-white">
        <span className="text-sm font-bold">{member.name} — {member.id}</span>
        <span className="text-sm font-medium">DOB: &nbsp;{member.dob}</span>
      </div>

      {/* Sub-header */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 py-1.5 border-b border-gray-200 bg-white">
        <span className="text-xs text-gray-500">Last opened app: a day ago</span>
        <div className="flex items-center gap-2">
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <span className="text-xs text-gray-500">View by type:</span>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="text-xs border border-gray-300 rounded px-1 py-0.5 outline-none text-gray-700"
            onMouseDown={e => e.stopPropagation()}
          >
            {['All', 'Messages', 'Images', 'Files'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-4 bg-white">
        {messages.map(msg => (
          <ChatMessage key={msg.id} msg={msg} />
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white">
        <div className="px-3 pt-2 pb-1">
          <p className="text-[10px] text-gray-400 mb-1">Enter message for member</p>
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-2 py-1.5">
            <button
              onMouseDown={e => e.stopPropagation()}
              className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 flex-shrink-0 text-base leading-none font-medium"
            >
              +
            </button>
            <input
              className="flex-1 text-xs italic text-gray-500 outline-none placeholder-gray-400"
              placeholder={`Message ${member.firstName} Garcia`}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') sendMessage() }}
              onMouseDown={e => e.stopPropagation()}
            />
            <button onMouseDown={e => e.stopPropagation()} className="text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between px-3 pb-2">
          <span className="text-[10px] text-gray-400">Tip: Type "." to get a list of available shortcuts</span>
          <button
            onMouseDown={e => e.stopPropagation()}
            onClick={sendMessage}
            disabled={!input.trim()}
            className="bg-[#4a9fd4] hover:bg-[#3a8fc4] disabled:opacity-40 text-white text-xs font-bold px-4 py-1.5 rounded transition-colors"
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  )
}

function ChatMessage({ msg }) {
  if (msg.type === 'member') {
    return (
      <div className="flex justify-center">
        <div className="max-w-[75%] bg-[#b8dff5] rounded-2xl px-4 py-2 text-sm text-gray-800">
          {msg.text}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="text-[10px] text-gray-500 flex items-center gap-1">
        <span className="font-semibold text-gray-700">{msg.sender}</span>
        <span>{msg.role}</span>
        <span>{msg.time}</span>
      </div>
      {msg.image && (
        <div className="relative">
          <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 text-gray-400 hover:text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <img src={msg.image} alt={msg.imageAlt} className="w-32 h-32 object-cover rounded-xl border border-gray-200" />
        </div>
      )}
      {msg.action && (
        <div className="bg-[#4a9fd4] text-white text-sm font-medium px-5 py-2 rounded-full">
          {msg.action}
        </div>
      )}
      {msg.text && (
        <div className="max-w-[80%] bg-[#3d4a5c] text-white rounded-2xl px-4 py-2 text-sm">
          {msg.text}
        </div>
      )}
    </div>
  )
}
