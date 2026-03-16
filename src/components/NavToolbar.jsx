import { useState, useRef, useEffect } from 'react'

export default function NavToolbar({ member, members, activeMemberId, onMemberChange }) {
  const [overlayOpen, setOverlayOpen] = useState(false)
  const btnRef = useRef(null)

  return (
    <div className="flex-shrink-0 bg-white border-b border-gray-200">
      <div className="flex items-stretch px-1 overflow-x-auto">

        {/* Home */}
        <button className="flex flex-col items-center justify-center px-2 py-1 text-[10px] gap-0.5 border-b-2 border-[#007999] text-[#007999] min-w-[40px]">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span className="flex items-center gap-0.5 whitespace-nowrap">Home
            <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </span>
        </button>

        {/* Person icon */}
        <button className="flex items-center justify-center px-2 py-1 text-gray-500 hover:bg-blue-50 hover:text-[#007999]">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>
        </button>

        {/* Menu icon */}
        <button className="flex items-center justify-center px-2 py-1 text-gray-500 hover:bg-blue-50 hover:text-[#007999]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Member tab — overlay selector */}
        <div className="mx-1 my-1">
          <button
            ref={btnRef}
            onClick={() => setOverlayOpen(o => !o)}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs border rounded-t bg-white whitespace-nowrap transition-colors ${
              overlayOpen
                ? 'border-[#007999] text-[#007999] bg-blue-50'
                : 'border-gray-300 text-gray-700 hover:bg-blue-50'
            }`}
          >
            <svg className="w-3.5 h-3.5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
            <span className="truncate max-w-[100px]">{member.name.substring(0, 16)}{member.name.length > 16 ? '…' : ''}</span>
            <svg
              className="w-3 h-3 text-gray-400 transition-transform duration-150"
              style={{ transform: overlayOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Member selector overlay */}
        {overlayOpen && <MemberOverlay
          members={members}
          activeMemberId={activeMemberId}
          anchorRef={btnRef}
          onSelect={(id) => { onMemberChange(id); setOverlayOpen(false) }}
          onClose={() => setOverlayOpen(false)}
        />}

        <div className="w-px bg-gray-200 mx-0.5 my-1" />

        {/* InPatient */}
        <button className="flex flex-col items-center justify-center px-2.5 py-1 text-[10px] text-gray-600 gap-0.5 hover:bg-blue-50 hover:text-[#007999] whitespace-nowrap">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span>InPatient</span>
        </button>

        {/* OutPatient */}
        <button className="flex flex-col items-center justify-center px-2.5 py-1 text-[10px] text-gray-600 gap-0.5 hover:bg-blue-50 hover:text-[#007999] whitespace-nowrap">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>OutPatient</span>
        </button>

        {/* Pharmacy */}
        <button className="flex flex-col items-center justify-center px-2.5 py-1 text-[10px] text-gray-600 gap-0.5 hover:bg-blue-50 hover:text-[#007999] whitespace-nowrap">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          <span>Pharmacy</span>
        </button>

        {/* Complaint */}
        <button className="flex flex-col items-center justify-center px-2.5 py-1 text-[10px] text-gray-600 gap-0.5 hover:bg-blue-50 hover:text-[#007999] whitespace-nowrap">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
          <span>Complaint</span>
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        <div className="w-px bg-gray-200 mx-0.5 my-1" />

        {/* Quick Links */}
        <button className="flex flex-col items-center justify-center px-2 py-1 text-[10px] text-gray-600 gap-0.5 hover:bg-blue-50 hover:text-[#007999] whitespace-nowrap">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <span className="flex items-center gap-0.5">Quick Links <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></span>
        </button>

        {/* Wellframe */}
        <button className="flex flex-col items-center justify-center px-2 py-1 text-[10px] text-gray-600 gap-0.5 hover:bg-blue-50 hover:text-[#007999] whitespace-nowrap">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>Wellframe</span>
        </button>

        {/* Calendar */}
        <button className="flex flex-col items-center justify-center px-2 py-1 text-[10px] text-gray-600 gap-0.5 hover:bg-blue-50 hover:text-[#007999] whitespace-nowrap">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Calendar</span>
        </button>

        {/* BRE */}
        <button className="flex flex-col items-center justify-center px-2 py-1 text-[10px] text-gray-600 gap-0.5 hover:bg-blue-50 hover:text-[#007999] whitespace-nowrap">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>BRE</span>
        </button>

        {/* Actions */}
        <button className="flex flex-col items-center justify-center px-2 py-1 text-[10px] text-gray-600 gap-0.5 hover:bg-blue-50 hover:text-[#007999] whitespace-nowrap">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
          <span className="flex items-center gap-0.5">Actions <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></span>
        </button>

        {/* Alerts */}
        <button className="flex flex-col items-center justify-center px-2 py-1 text-[10px] text-gray-600 gap-0.5 hover:bg-blue-50 hover:text-[#007999] whitespace-nowrap">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span>Alerts</span>
        </button>

        {/* Admin */}
        <button className="flex flex-col items-center justify-center px-2 py-1 text-[10px] text-gray-600 gap-0.5 hover:bg-blue-50 hover:text-[#007999] whitespace-nowrap">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="flex items-center gap-0.5">Admin <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></span>
        </button>

        {/* Config */}
        <button className="flex flex-col items-center justify-center px-2 py-1 text-[10px] text-gray-600 gap-0.5 hover:bg-blue-50 hover:text-[#007999] whitespace-nowrap">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <span className="flex items-center gap-0.5">Config <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></span>
        </button>

        {/* Know */}
        <button className="flex flex-col items-center justify-center px-2 py-1 text-[10px] text-gray-600 gap-0.5 hover:bg-blue-50 hover:text-[#007999] whitespace-nowrap">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="flex items-center gap-0.5">Know <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></span>
        </button>

        {/* Manage */}
        <button className="flex flex-col items-center justify-center px-2 py-1 text-[10px] text-gray-600 gap-0.5 hover:bg-blue-50 hover:text-[#007999] whitespace-nowrap">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
          <span className="flex items-center gap-0.5">Manage <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></span>
        </button>

        {/* Settings */}
        <button className="flex flex-col items-center justify-center px-2 py-1 text-[10px] text-gray-600 gap-0.5 hover:bg-blue-50 hover:text-[#007999] whitespace-nowrap">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="flex items-center gap-0.5">Settings <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></span>
        </button>

      </div>
    </div>
  )
}

function MemberOverlay({ members, activeMemberId, anchorRef, onSelect, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const rect = anchorRef.current?.getBoundingClientRect()
  const left = rect ? rect.left : 0
  const top = rect ? rect.bottom + 4 : 0

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Overlay panel */}
      <div
        className="fixed z-50 bg-white rounded-xl overflow-hidden"
        style={{
          left,
          top,
          width: 340,
          boxShadow: '0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)',
          border: '1px solid rgba(0,0,0,0.10)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Switch Member</span>
          <button
            onClick={onClose}
            className="w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Member cards */}
        <div className="p-3 flex flex-col gap-2">
          {members.map((m) => {
            const isActive = m.id === activeMemberId
            return (
              <button
                key={m.id}
                onClick={() => onSelect(m.id)}
                className="w-full text-left rounded-lg px-3 py-3 flex items-center gap-3 transition-colors"
                style={{
                  background: isActive ? '#EFF8FF' : 'white',
                  border: isActive ? '1.5px solid #007999' : '1.5px solid #e5e7eb',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#f9fafb' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'white' }}
              >
                {/* Avatar */}
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                  style={{ background: isActive ? '#007999' : '#9ca3af' }}
                >
                  {m.firstName[0]}{m.lastName[0]}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm font-semibold truncate ${isActive ? 'text-[#007999]' : 'text-gray-800'}`}>
                      {m.name}
                    </span>
                    {isActive && (
                      <span className="flex-shrink-0 text-[10px] font-medium text-white bg-[#007999] px-1.5 py-0.5 rounded-full leading-none">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    {m.id} · DOB {m.dob} · Age {m.age}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    {m.primaryInsurance || m.secondaryInsurance || 'No insurance on file'} · {m.primaryCareProvider}
                  </div>
                </div>

                {/* Checkmark */}
                {isActive && (
                  <svg className="w-4 h-4 text-[#007999] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
