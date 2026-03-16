export default function BrowserChrome() {
  return (
    <div className="flex-shrink-0 bg-[#dee1e6] border-b border-[#b0b4bb]">
      {/* Tab bar */}
      <div className="flex items-center px-2 pt-1.5 gap-1 bg-[#dee1e6]">
        {/* Window control buttons */}
        <div className="flex gap-1.5 mr-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-90 cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-90 cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-[#28ca41] hover:brightness-90 cursor-pointer" />
        </div>
        {/* Tab */}
        <div className="flex items-center bg-white rounded-t px-3 py-1.5 text-xs text-gray-700 gap-2 shadow-sm min-w-[180px]">
          <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-[8px] text-blue-600">●</span>
          </div>
          <span className="truncate">New Tab</span>
          <svg className="w-3 h-3 text-gray-400 ml-auto hover:text-gray-600 cursor-pointer" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 5L10 1M6 5L2 1M6 5L10 9M6 5L2 9" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          </svg>
        </div>
        {/* New tab button */}
        <button className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-300 rounded-full text-lg leading-none">+</button>
      </div>

      {/* Address bar row */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f0f2f5]">
        {/* Nav buttons */}
        <div className="flex items-center gap-1">
          <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-300 text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-300 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-300 text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Address bar */}
        <div className="flex-1 flex items-center bg-white border border-gray-300 rounded-full px-3 py-1 gap-2 text-xs shadow-sm">
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-gray-700">healthedge.com</span>
          <div className="ml-auto flex items-center gap-1">
            <span className="text-blue-600 text-[10px] border border-blue-400 rounded px-1.5 py-0.5 font-medium">AI Mode</span>
          </div>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-1 text-gray-500">
          {['⊕','⊞','⊟','⊡','☰'].map((icon, i) => (
            <button key={i} className="w-7 h-7 flex items-center justify-center hover:bg-gray-300 rounded text-sm">{icon}</button>
          ))}
          <span className="text-xs text-blue-600 ml-1 whitespace-nowrap cursor-pointer hover:underline">New Chrome available</span>
        </div>
      </div>
    </div>
  )
}
