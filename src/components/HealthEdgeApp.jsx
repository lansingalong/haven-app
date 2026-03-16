import { useState, useRef } from 'react'
import Header from './Header'
import NavToolbar from './NavToolbar'
import MemberBanner from './MemberBanner'
import Sidebar from './Sidebar'
import MemberDetails from './MemberDetails'
import HavenPanel from './haven/HavenPanel'
import MemberChatWindow from './MemberChatWindow'

export default function HealthEdgeApp() {
  const [havenOpen, setHavenOpen] = useState(false)
  const havenBtnRef = useRef(null)
  const [toolbarCollapsed, setToolbarCollapsed] = useState(false)

  const [chatOpen, setChatOpen] = useState(false)
  const chatBtnRef = useRef(null)

  const member = {
    name: 'Henry Tom Garcia',
    firstName: 'Henry',
    lastName: 'Garcia',
    id: 'AH0000007',
    dob: '01/01/2001',
    age: '24',
    preferredPhone: '909-851-3064',
    primaryCareProvider: 'Ambetter',
    havensName: 'Henry James Garcia',
    havensMemberId: 'AH00000009',
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden relative">

      {/* Top header */}
      <Header />
      <NavToolbar member={member} />

      {/* Member banner */}
      <MemberBanner member={member} />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
          <MemberDetails member={member} />
        </div>
      </div>

      {/* Bottom-right toolbar */}
      <div className="fixed bottom-5 right-5 flex items-center bg-white border border-gray-200 rounded-2xl shadow-lg z-40 overflow-hidden transition-all duration-200">
        {/* Chevron — collapses/expands toolbar */}
        <button
          onClick={() => setToolbarCollapsed(c => !c)}
          className="flex items-center justify-center px-3 py-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <svg
            className="w-4 h-4 transition-transform duration-200"
            style={{ transform: toolbarCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Collapsible content */}
        {!toolbarCollapsed && <>
          {/* Divider */}
          <div className="w-px h-8 bg-gray-200" />

          {/* Henry Garcia chat button */}
          <button
            ref={chatBtnRef}
            onClick={() => setChatOpen(o => !o)}
            className={`flex items-center gap-2.5 mx-2 my-1.5 px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${
              chatOpen
                ? 'border border-[#3b82f6] text-[#3b82f6] bg-white'
                : 'hover:bg-gray-50 text-gray-800'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke={chatOpen ? '#3b82f6' : '#2563eb'}
              strokeWidth={1.8}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z" />
            </svg>
            Henry Garcia
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-200" />

          {/* Haven button */}
          <button
            ref={havenBtnRef}
            onClick={() => setHavenOpen(o => !o)}
            className={`flex items-center gap-2 mx-2 my-1.5 px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${
              havenOpen
                ? 'border border-[#3b82f6] text-[#3b82f6] bg-white'
                : 'bg-[#2a52a0] hover:bg-[#1e3f7a] text-white'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill={havenOpen ? '#3b82f6' : 'white'}>
              <path d="M12 2c0 0 1 6.5 4 8.5c-3 2-4 11.5-4 11.5s-1-9.5-4-11.5c3-2 4-8.5 4-8.5z"/>
              <path d="M2 12c0 0 6.5 1 8.5 4c2-3 11.5-4 11.5-4s-9.5-1-11.5-4c-2 3-8.5 4-8.5 4z"/>
            </svg>
            Haven
          </button>
        </>}
      </div>

      {/* Haven floating window — always occupies rightmost slot */}
      {havenOpen && (() => {
        const panelW = Math.min(400, window.innerWidth - 16)
        const panelH = Math.min(620, window.innerHeight - 80)
        const gap = 8
        const btnBar = havenBtnRef.current ? havenBtnRef.current.closest('div') : null
        const barTop = btnBar ? btnBar.getBoundingClientRect().top : window.innerHeight - 50
        const y = Math.max(4, barTop - panelH - gap)
        const x = window.innerWidth - panelW - 4
        return (
          <HavenPanel
            member={member}
            initialPos={{ x, y }}
            onClose={() => setHavenOpen(false)}
          />
        )
      })()}

      {/* Member chat window — sits to the left of Haven slot */}
      {chatOpen && (() => {
        const havenW = Math.min(400, window.innerWidth - 16)
        const chatW = Math.min(380, window.innerWidth - 16)
        const panelH = Math.min(560, window.innerHeight - 80)
        const gap = 8
        const btnBar = havenBtnRef.current ? havenBtnRef.current.closest('div') : null
        const barTop = btnBar ? btnBar.getBoundingClientRect().top : window.innerHeight - 50
        const y = Math.max(4, barTop - panelH - gap)
        const havenX = window.innerWidth - havenW - 4
        const x = Math.max(4, havenX - chatW - gap)
        return (
          <MemberChatWindow
            member={member}
            initialPos={{ x, y }}
            onClose={() => setChatOpen(false)}
          />
        )
      })()}
    </div>
  )
}
