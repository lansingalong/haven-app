import { useState, useRef, useEffect } from 'react'
import Header from './Header'
import NavToolbar from './NavToolbar'
import MemberBanner from './MemberBanner'
import Sidebar from './Sidebar'
import MemberDetails from './MemberDetails'
import HavenPanel from './haven/HavenPanel'
import MemberChatWindow from './MemberChatWindow'

export const MEMBERS = [
  {
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
    // MemberDetails fields
    gender: 'Male',
    preferredName: 'Preferred Name xbeew',
    genderIdentity: 'Male',
    sexualOrientation: null,
    preferredPronouns: 'He/him/his',
    primaryPhone: '259-391-3698',
    cellPhone: '111-111-1111',
    alternatePhone: '909-851-3064',
    fax: '233-366-0778',
    preferredCallTime: 'M-F 12pm-1pm',
    primaryLanguage: 'English',
    writtenLanguage: 'Spanish',
    spokenLanguage: 'English',
    communicationImpairments: 'Visually Impaired, Large Font, Hard of Hearing, Illiterate, Interpreter Needed, Braille Needed, Deaf, Aphasic',
    address: 'Address gikmt',
    city: 'CityElgM',
    state: 'VA',
    zip: '20191',
    county: 'ADA COUNTY',
    country: null,
    primaryInsurance: null,
    primaryPolicyNum: 'XvAicS',
    secondaryInsurance: 'Medicaid',
    secondaryPolicyNum: '98767682',
  },
  {
    name: 'Lisa Marie Thompson',
    firstName: 'Lisa',
    lastName: 'Thompson',
    id: 'AH0000042',
    dob: '05/15/1978',
    age: '47',
    preferredPhone: '312-555-0189',
    primaryCareProvider: 'BlueCross',
    havensName: 'Lisa Marie Thompson',
    havensMemberId: 'AH00000044',
    // MemberDetails fields
    gender: 'Female',
    preferredName: null,
    genderIdentity: 'Female',
    sexualOrientation: null,
    preferredPronouns: 'She/her/hers',
    primaryPhone: '312-555-0189',
    cellPhone: '312-555-0201',
    alternatePhone: null,
    fax: null,
    preferredCallTime: 'Weekdays after 4:00 PM',
    primaryLanguage: 'English',
    writtenLanguage: 'English',
    spokenLanguage: 'English',
    communicationImpairments: null,
    address: '4821 Maple Avenue',
    city: 'Chicago',
    state: 'IL',
    zip: '60614',
    county: 'COOK COUNTY',
    country: 'United States',
    primaryInsurance: 'Medicare Advantage',
    primaryPolicyNum: 'MCR442019',
    secondaryInsurance: null,
    secondaryPolicyNum: null,
  },
]

export default function HealthEdgeApp() {
  const [activeMemberId, setActiveMemberId] = useState('AH0000007')
  const member = MEMBERS.find(m => m.id === activeMemberId)

  const [havenOpen, setHavenOpen] = useState(false)
  const havenBtnRef = useRef(null)
  const [toolbarCollapsed, setToolbarCollapsed] = useState(false)

  const [chatOpen, setChatOpen] = useState(false)
  const chatBtnRef = useRef(null)

  const handleMemberChange = (memberId) => {
    if (memberId === activeMemberId) return
    setActiveMemberId(memberId)
  }

  // Always close panels when member changes
  useEffect(() => {
    setHavenOpen(false)
    setChatOpen(false)
  }, [activeMemberId])

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden relative">

      {/* Top header */}
      <Header />
      <NavToolbar
        member={member}
        members={MEMBERS}
        activeMemberId={activeMemberId}
        onMemberChange={handleMemberChange}
      />

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

          {/* Member chat button */}
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
            {member.firstName} {member.lastName}
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

      {/* Haven floating window */}
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
            key={member.id}
            member={member}
            initialPos={{ x, y }}
            onClose={() => setHavenOpen(false)}
          />
        )
      })()}

      {/* Member chat window */}
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
            key={member.id}
            member={member}
            initialPos={{ x, y }}
            onClose={() => setChatOpen(false)}
          />
        )
      })()}
    </div>
  )
}
