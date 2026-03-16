export default function MemberBanner({ member }) {
  return (
    <div className="flex-shrink-0 flex items-center gap-3 px-3 py-1.5 bg-white border-b border-gray-200 text-xs">
      {/* Alert icon */}
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-[10px] flex-shrink-0">!</div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
          <span className="font-semibold text-gray-800">
            {member.name}-{member.id}
          </span>
          <span className="text-gray-600">DOB {member.dob} {member.age} yr(s)</span>
        </div>
      </div>

      <span className="text-gray-300">|</span>

      {/* Warning badges */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-orange-600">
          <span className="text-orange-500">⚠</span>
          <span className="underline cursor-pointer hover:text-orange-800">Currently accessed by another care staff</span>
        </div>
        <span className="text-gray-300">|</span>
        <div className="flex items-center gap-1 text-orange-600">
          <span className="text-orange-500">⚠</span>
          <span className="underline cursor-pointer hover:text-orange-800">Service Interruption</span>
        </div>
        <span className="text-gray-300">|</span>
        <div className="flex items-center gap-1 text-red-600">
          <span className="text-red-500">⚠</span>
          <span className="underline cursor-pointer hover:text-red-800">Life Threatening Allergies</span>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />
    </div>
  )
}
