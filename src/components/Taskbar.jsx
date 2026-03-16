export default function Taskbar() {
  const now = new Date()
  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  const date = now.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })

  return (
    <div className="flex-shrink-0 flex items-center justify-between px-2 h-10 bg-[#1a1b26] text-white">
      {/* Windows start + search */}
      <div className="flex items-center gap-2">
        {/* Windows logo */}
        <button className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded p-1">
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path fill="#00adef" d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
          </svg>
        </button>
        <button className="flex items-center gap-2 bg-white/10 hover:bg-white/15 rounded px-3 py-1 text-xs text-white/80 w-44">
          <svg className="w-3.5 h-3.5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Search</span>
        </button>
      </div>

      {/* Center app icons */}
      <div className="flex items-center gap-0.5">
        {/* Edge */}
        <button className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded">
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path fill="#0078D4" d="M21.86 17.86c-.35.19-.72.35-1.11.47A8.6 8.6 0 0118 18.75a8.72 8.72 0 01-8.72-8.72c0-1.26.27-2.46.75-3.54A10.11 10.11 0 003 16.5C3 21.75 7.25 26 12.5 26S22 21.75 22 16.5c0-.65-.07-1.28-.14-1.64z"/>
            <path fill="#1A8FFF" d="M12.5 2C7.81 2 4 5.81 4 10.5c0 2.5 1.05 4.76 2.73 6.36A8.65 8.65 0 0112.5 18.75a8.6 8.6 0 002.75-.42A8.72 8.72 0 0021 9.9C21 5.57 17.18 2 12.5 2z"/>
          </svg>
        </button>
        {/* Mail */}
        <button className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded">
          <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
        </button>
        {/* File explorer */}
        <button className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded">
          <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
          </svg>
        </button>
        {/* Zoom */}
        <button className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded text-blue-400 font-bold text-sm">
          Z
        </button>
        {/* Teams */}
        <button className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded text-purple-300 font-bold text-sm">
          T
        </button>
      </div>

      {/* Right: system tray + clock */}
      <div className="flex items-center gap-2">
        <div className="text-xs text-white/70">8°C Partly sunny</div>
        <div className="flex flex-col items-end text-[10px] text-white/80 leading-tight">
          <span>{time}</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  )
}
