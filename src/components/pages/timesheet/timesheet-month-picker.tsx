'use client';
import { buddhistFormatDate } from '@/lib/functions/date-format';
import { cn } from '@/lib/utils';
import { addYears, subYears } from 'date-fns';
import { useState } from 'react';

interface IProps {
  current?: number;
  minYear?: number;
  maxYear?: number;
  className?: string;
  onSelect?: (month: number) => void;
}

const MonthPicker = ({ current, minYear, maxYear, className, onSelect }: IProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showYearPicker, setShowYearPicker] = useState(false);

  const handleMonthSelect = (month: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(month);
    setSelectedDate(newDate);

    if (onSelect) {
      onSelect(month);
    }
  };

  const handleYearChange = (year: number) => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(year);
    setSelectedDate(newDate);
    setShowYearPicker(false);
  };

  const currentYear = selectedDate.getFullYear();
  const currentMonth = current ? current : selectedDate.getMonth() - 1;

  return (
    <div className={cn('w-full h-full p-2 bg-white rounded-lg', className)}>
      <div className="flex justify-center gap-x-4 items-center w-full">
        <button
          className="cursor-pointer font-bold"
          onClick={() => setSelectedDate(subYears(selectedDate, 1))}
        >
          {'<'}
        </button>
        <button
          className="text-lg font-semibold cursor-pointer py-1 px-2 rounded-lg flex items-center justify-center border border-transparent hover:border-gray-400 hover:scale-105 transition-all"
          onClick={() => setShowYearPicker(!showYearPicker)}
        >
          {buddhistFormatDate(String(currentYear), 'yyyy')}
        </button>
        <button
          className="cursor-pointer font-bold"
          onClick={() => setSelectedDate(addYears(selectedDate, 1))}
        >
          {'>'}
        </button>
      </div>
      {(() => {
        if (showYearPicker) {
          return (
            <div className=" mt-2 w-full bg-white rounded-lg ">
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 20 }, (_, index) => currentYear - 10 + index).map(
                  (year, index) => (
                    <button
                      key={year}
                      className={` text-center rounded-lg cursor-pointer hover:bg-gray-200 px-4 py-2 flex items-center justify-center ${
                        index === currentMonth ? 'bg-primary text-black hover:text-black' : ''
                      } `}
                      onClick={() => handleYearChange(year)}
                    >
                      {buddhistFormatDate(String(year), 'yyyy')}
                    </button>
                  )
                )}
              </div>
            </div>
          );
        } else {
          return (
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: 12 }, (_, index) => (
                <button
                  key={index}
                  className={`py-1 text-center text-sm rounded-md cursor-pointer hover:bg-yellow-200 font-semibold ${
                    index === selectedDate.getMonth()
                      ? 'bg-primary text-black hover:text-black'
                      : ''
                  } `}
                  onClick={() => handleMonthSelect(index)}
                >
                  {buddhistFormatDate(new Date(2021, index), 'mmm')}
                </button>
              ))}
            </div>
          );
        }
      })()}
    </div>
  );
};

export default MonthPicker;
