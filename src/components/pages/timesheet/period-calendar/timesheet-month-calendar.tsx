'use client';

const TimeSheetMonthCalendar = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  // Adjust for Monday Start
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const blanks = Array(startOffset).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const totalSlots = [...blanks, ...days];
  return (
    <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-[#F5F6F8]">
      <div className="grid grid-cols-7 gap-px bg-[#F5F6F8] border border-neutral-800 rounded-lg overflow-hidden shadow-lg">
        {['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'].map((d) => (
          <div
            key={d}
            className=" p-3 text-center text-xs font-bold text-neutral-500 uppercase bg-[#F5F6F8]"
          >
            {d}
          </div>
        ))}
        {totalSlots.map((day, index) => {
          if (!day) return <div key={index} className="bg-[#F5F6F8] min-h-[120px]" />;
          return (
            <div
              key={index}
              className="bg-[#F5F6F8] hover:bg-neutral-400 hover:border-0 cursor-pointer min-h-[120px] p-2  transition-colors border-t border-neutral-800 relative group"
            >
              <div
                className={`text-sm font-bold mb-2 w-7 h-7 flex items-center justify-center rounded-full  text-neutral-400 group-hover:text-black
       `}
              >
                {day}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSheetMonthCalendar;
