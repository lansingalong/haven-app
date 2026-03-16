export default function CloseDialog({ onCancel, onExit }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-5 mx-4 max-w-xs w-full">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Close Haven?</h3>
        <p className="text-xs text-gray-600 mb-4 leading-relaxed">
          Closing Haven will also close your current chat session.
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-1.5 text-xs border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onExit}
            className="px-4 py-1.5 text-xs bg-[#2563eb] hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  )
}
