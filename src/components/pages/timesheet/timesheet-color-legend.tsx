'use client';

const TimeSheetColorLegend = () => {
  const legends = [
    {
      label: 'วันปัจจุบัน',
      color: '#000',
    },
    {
      label: 'ลงเวลาไม่ครบ',
      color: '#FFA722',
    },
    {
      label: 'ไม่ได้ลงเวลา',
      color: '#ff0000',
    },
    {
      label: 'วันหยุด',
      color: '#D9D9D9',
    },
  ];

  return (
    <div className="bg-[#f4f4f4] rounded-full py-2 px-3 w-full lg:max-w-md ">
      <div className="flex justify-around items-start md:items-center flex-wrap md:flex-nowrap  gap-4">
        {legends.map((legend, index) => (
          <div key={index} className="flex  items-center gap-1 text-nowrap text-xs md:text-base">
            <div className="rounded-full w-3 h-3" style={{ backgroundColor: legend.color }} />
            {legend.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeSheetColorLegend;
