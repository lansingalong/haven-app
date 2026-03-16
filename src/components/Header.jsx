export default function Header() {
  return (
    <div className="flex-shrink-0 bg-white border-b border-gray-200">
      <div className="flex items-center px-3 py-1.5 gap-3 min-w-0">

        {/* Logo */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <div className="w-8 h-8 bg-[#007999] rounded flex items-center justify-center mr-1">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 4h7v7H4zm9 0h7v7h-7zM4 13h7v7H4zm9 9v-4h4v4zm4-9v4h4v-4zm-4 0h4v4h-4z"/>
            </svg>
          </div>
          <div className="flex items-center gap-0">
            <span className="text-[#007999] font-black text-xl tracking-tight leading-none">HEALTH</span>
            <div className="relative">
              <span className="text-[#007999] font-black text-xl tracking-tight leading-none">EDGE</span>
              <div className="absolute -top-0.5 -right-1.5 w-2 h-2 bg-[#1a6aad] rounded-full" />
            </div>
          </div>
        </div>

        {/* Care Coordination notice */}
        <div className="text-[10px] leading-tight border-l border-gray-200 pl-2 flex-shrink-0">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-[#007999] rounded-sm flex items-center justify-center flex-shrink-0">
              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-[#007999] whitespace-nowrap">You are in Care Coordination</div>
              <div className="text-blue-600 underline cursor-pointer hover:text-blue-800 whitespace-nowrap">Go to Population Health</div>
            </div>
          </div>
        </div>

        {/* Search area */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="flex items-center border border-gray-300 rounded overflow-hidden text-xs">
            <button className="flex items-center gap-1 px-2 py-1.5 bg-gray-50 border-r border-gray-300 text-gray-600 hover:bg-gray-100 whitespace-nowrap">
              MEMBER NAME
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <input
              className="px-2 py-1.5 text-xs text-gray-500 outline-none w-44 bg-white"
              placeholder="Enter text to search"
            />
            <button className="px-2 py-1.5 bg-gray-50 border-l border-gray-300 hover:bg-gray-100">
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          <button className="flex items-center gap-1 px-2 py-1.5 border border-gray-300 rounded text-xs text-gray-600 hover:bg-gray-50 whitespace-nowrap">
            Advanced Search
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Notification icons */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Building/tasks icon */}
          <div className="relative cursor-pointer">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">0</span>
          </div>
          {/* Mail icon */}
          <div className="relative cursor-pointer">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">0</span>
          </div>
        </div>

        <div className="w-px h-6 bg-gray-200" />

        {/* User info */}
        <div className="text-[10px] leading-tight flex-shrink-0">
          <div>
            <span className="text-gray-500">Welcome </span>
            <span className="text-blue-600 font-semibold cursor-pointer hover:underline">Prudhvi</span>
          </div>
          <div className="text-gray-500">All Access Admin</div>
          <div className="text-gray-500">Time zone: <span className="font-medium text-gray-700">EST</span></div>
        </div>

        {/* User avatar + settings */}
        <button className="flex items-center gap-0.5 hover:bg-gray-100 rounded p-0.5">
          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </div>
          <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Help button */}
        <button className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center text-gray-500 text-xs font-bold hover:bg-gray-100 flex-shrink-0">?</button>
      </div>
    </div>
  )
}
