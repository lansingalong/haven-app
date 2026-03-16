const cannotDo = [
  'Clinical decisions or diagnosis',
  'Accessing systems outside this platform',
  'Guarantee accurate information, always verify yourself',
]

const canDo = [
  'Member demographics',
  'Clinical history',
  'Care plan (goals, interventions)',
  'Assessments',
  'Eligibility',
  'Care gaps',
  'Claims data',
]

export default function CapabilitiesView({ onBack }) {
  return (
    <div className="flex flex-col gap-3 pt-2">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 self-start"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <h3 className="text-xs font-semibold text-gray-800">What does Haven have access to?</h3>

      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium text-gray-700">I don't have access to:</p>
        {cannotDo.map(item => (
          <div key={item} className="flex items-start gap-1.5 text-xs text-gray-600">
            <span className="text-red-400 mt-0.5 flex-shrink-0">•</span>
            <span>{item}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium text-gray-700">I have access to:</p>
        {canDo.map(item => (
          <div key={item} className="flex items-start gap-1.5 text-xs text-gray-600">
            <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
