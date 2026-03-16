const Field = ({ label, value, valueClass = '' }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[10px] text-gray-500">{label}</span>
    <span className={`text-xs text-gray-800 ${valueClass}`}>{value || <span className="text-gray-400 italic">Not Available</span>}</span>
  </div>
)

const Section = ({ title, children, id }) => (
  <div id={id} className="border border-gray-200 rounded mb-3 scroll-mt-2">
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
          <Section title="Personal Details" id="member-personal">
            <Field label="Member Name (F-M-L)" value={member.name} />
            <Field label="Preferred Name" value={member.preferredName} />
            <Field label="Gender" value={member.gender} />
            <Field label="Gender Identity" value={member.genderIdentity} />
            <Field label="Sexual Orientation" value={member.sexualOrientation} />
            <Field label="Preferred Pronouns" value={member.preferredPronouns} />
            <Field label="Date of Birth" value={
              member.dob
                ? new Date(member.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' })
                : null
            } />
            <Field label="New ID" value={member.id} />
            <Field label="Member ID" value={member.id} />
            <Field label="Preferred Contact Format" value={null} />
            <div className="col-span-2">
              <Field label="Service Interruption" value={
                <span className="text-blue-600 underline cursor-pointer hover:text-blue-800">blood test Nursing Home.demo</span>
              } />
            </div>
          </Section>

          <Section title="Phone Numbers" id="member-phone">
            <Field label="Preferred Phone" value={<span className="text-blue-600 underline cursor-pointer">{member.preferredPhone}</span>} />
            <Field label="Primary Phone" value={
              member.primaryPhone
                ? <span className="flex items-center gap-1">
                    <span className="text-blue-600 underline cursor-pointer">{member.primaryPhone}</span>
                    <span className="w-3.5 h-3.5 rounded-full border border-gray-400 flex items-center justify-center text-[8px] text-gray-500 cursor-pointer">i</span>
                  </span>
                : null
            } />
            <Field label="Cell Phone" value={member.cellPhone ? <span className="text-blue-600 underline cursor-pointer">{member.cellPhone}</span> : null} />
            <Field label="Alternate Phone" value={member.alternatePhone ? <span className="text-blue-600 underline cursor-pointer">{member.alternatePhone}</span> : null} />
            <Field label="Fax" value={member.fax} />
            <Field label="Preferred Time to Call" value={member.preferredCallTime} />
          </Section>
        </div>

        {/* Right column */}
        <div>
          <Section title="Languages" id="member-languages">
            <Field label="Primary Language" value={member.primaryLanguage} />
            <Field label="Preferred Written Language(s)" value={member.writtenLanguage} />
            <Field label="Preferred Spoken Language(s)" value={member.spokenLanguage} />
            <div className="col-span-2">
              <Field label="Communication Impairment" value={member.communicationImpairments} />
            </div>
          </Section>

          <Section title="Address" id="member-address">
            <Field label="Address" value={
              member.address
                ? <span className="flex items-center gap-1">
                    {member.address}
                    <span className="w-3.5 h-3.5 rounded-full border border-gray-400 flex items-center justify-center text-[8px] text-gray-500 cursor-pointer">i</span>
                  </span>
                : null
            } />
            <Field label="City" value={member.city} />
            <Field label="State / Province" value={member.state} />
            <Field label="Zip / Postal Code" value={member.zip} />
            <Field label="County" value={member.county} />
            <Field label="Country" value={member.country} />
          </Section>

          <Section title="Medical IDs" id="member-medical-ids">
            <Field label="Primary Insurance" value={member.primaryInsurance} />
            <Field label="Primary Ins. Policy #" value={member.primaryPolicyNum} />
            <Field label="Secondary Insurance" value={member.secondaryInsurance} />
            <Field label="Secondary Ins. Policy #" value={member.secondaryPolicyNum} />
          </Section>
        </div>
      </div>
    </div>
  )
}
