const Field = ({ label, value, valueClass = '' }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[10px] text-gray-500">{label}</span>
    <span className={`text-xs text-gray-800 ${valueClass}`}>{value || <span className="text-gray-400 italic">Not Available</span>}</span>
  </div>
)

const Section = ({ title, children }) => (
  <div className="border border-gray-200 rounded mb-3">
    <div className="px-3 py-2 border-b border-gray-100 bg-gray-50">
      <h3 className="text-xs font-semibold text-gray-700">{title}</h3>
    </div>
    <div className="px-3 py-3 grid grid-cols-2 gap-x-8 gap-y-2.5">
      {children}
    </div>
  </div>
)

export default function MemberDetails({ member }) {
  return (
    <div className="p-3">
      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-gray-200 mb-3">
        {['Member Details', 'Caregivers', 'Care Team', 'Programs', 'Eligibility', 'UDT'].map((tab, i) => (
          <button
            key={tab}
            className={`px-3 py-2 text-xs border-b-2 -mb-px transition-colors whitespace-nowrap ${
              i === 0
                ? 'border-[#007999] text-[#007999] font-medium'
                : 'border-transparent text-gray-600 hover:text-[#007999] hover:border-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
        <div className="flex-1" />
        <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mb-1 mr-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-2 gap-3">
        {/* Left column */}
        <div>
          <Section title="Personal Details">
            <Field label="Member Name (F-M-L)" value="Henry Tom Garcia" />
            <Field label="Preferred Name" value="Preferred Name xbeew" />
            <Field label="Gender" value="Male" />
            <Field label="Gender Identity" value="Male" />
            <Field label="Sexual Orientation" value={null} />
            <Field label="Preferred Pronouns" value="He/him/his" />
            <Field label="Date of Birth" value="January 01, 2001" />
            <Field label="New ID" value="AH0000007" />
            <Field label="Member ID" value="AH0000007" />
            <Field label="Preferred Contact Format" value={null} />
            <div className="col-span-2">
              <Field label="Service Interruption" value={
                <span className="text-blue-600 underline cursor-pointer hover:text-blue-800">blood test Nursing Home.demo</span>
              } />
            </div>
          </Section>

          <Section title="Phone Numbers">
            <Field label="Preferred Phone" value={<span className="text-blue-600 underline cursor-pointer">309-851-3064</span>} />
            <Field label="Primary Phone" value={
              <span className="flex items-center gap-1">
                <span className="text-blue-600 underline cursor-pointer">259-391-3698</span>
                <span className="w-3.5 h-3.5 rounded-full border border-gray-400 flex items-center justify-center text-[8px] text-gray-500 cursor-pointer">i</span>
              </span>
            } />
            <Field label="Cell Phone" value={<span className="text-blue-600 underline cursor-pointer">111-111-1111</span>} />
            <Field label="Alternate Phone" value={<span className="text-blue-600 underline cursor-pointer">309-851-3064</span>} />
            <Field label="Fax" value="233-366-0778" />
            <Field label="Preferred Time to Call" value="M-F 12pm-1pm" />
          </Section>
        </div>

        {/* Right column */}
        <div>
          <Section title="Languages">
            <Field label="Primary Language" value="English" />
            <Field label="Preferred Written Language(s)" value="Spanish" />
            <Field label="Preferred Spoken Language(s)" value="English" />
            <div className="col-span-2">
              <Field label="Communication Impairment" value="Visually Impaired, Large Font, Hard of Hearing, Illiterate, Interpreter Needed, Braille Needed, Deaf, Aphasic" />
            </div>
          </Section>

          <Section title="Address">
            <Field label="Address" value={
              <span className="flex items-center gap-1">
                Address gikmt
                <span className="w-3.5 h-3.5 rounded-full border border-gray-400 flex items-center justify-center text-[8px] text-gray-500 cursor-pointer">i</span>
              </span>
            } />
            <Field label="City" value="CityElgM" />
            <Field label="State / Province" value="VA" />
            <Field label="Zip / Postal Code" value="20191" />
            <Field label="County" value="ADA COUNTY" />
            <Field label="Country" value={null} />
          </Section>

          <Section title="Medical IDs">
            <Field label="Primary Insurance" value={null} />
            <Field label="Primary Ins. Policy #" value="XvAicS" />
            <Field label="Secondary Insurance" value="Medicaid" />
            <Field label="Secondary Ins. Policy #" value="98767682" />
          </Section>
        </div>
      </div>
    </div>
  )
}
