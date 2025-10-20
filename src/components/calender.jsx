// src/components/Calendar.jsx

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useState, useMemo } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

dayjs.extend(isBetween);

export default function Calendar({ selectedDate, setSelectedDate, bookedDates = [] }) {
    const today = dayjs().startOf('day');

    const [currentMonthIndex, setCurrentMonthIndex] = useState(0);

    const referenceMonth = today.add(currentMonthIndex, 'month');


    const bookedDateSet = useMemo(() => new Set(bookedDates), [bookedDates]);

    const getDaysInMonth = (month) => {
        const startOfMonth = month.startOf("month");
        const endOfMonth = month.endOf("month");


        let startDayOfWeek = startOfMonth.day();



        let numPaddingDays = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

        const days = [];


        for (let i = numPaddingDays; i > 0; i--) {
            days.push({
                date: startOfMonth.subtract(i, 'day').format("YYYY-MM-DD"),
                isPadding: true,
                dayjsObject: startOfMonth.subtract(i, 'day')
            });
        }


        let d = startOfMonth;
        while (d.isBefore(endOfMonth) || d.isSame(endOfMonth, 'day')) {
            days.push({
                date: d.format("YYYY-MM-DD"),
                isPadding: false,
                dayjsObject: d
            });
            d = d.add(1, "day");
        }


        const totalCells = days.length;
        const numPostPadding = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
        for (let i = 1; i <= numPostPadding; i++) {
            days.push({
                date: endOfMonth.add(i, 'day').format("YYYY-MM-DD"),
                isPadding: true,
                dayjsObject: endOfMonth.add(i, 'day')
            });
        }

        return days;
    };

    const days = getDaysInMonth(referenceMonth);


    const MAX_MONTH_INDEX = 1;
    const canMoveForward = currentMonthIndex < MAX_MONTH_INDEX;
    const canMoveBack = currentMonthIndex > 0;

    return (
        <div className="bg-white p-6 shadow-xl w-full">

            <div className="flex justify-between items-center mb-4 border-b pb-3">
                <button
                    onClick={() => canMoveBack && setCurrentMonthIndex(currentMonthIndex - 1)}
                    disabled={!canMoveBack}
                    className={`p-2 rounded-full transition ${!canMoveBack ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'}`}
                >
                    <FaChevronLeft size={16} />
                </button>
                <h2 className="text-xl font-bold text-gray-800">{referenceMonth.format("MMMM YYYY")}</h2>
                <button
                    onClick={() => canMoveForward && setCurrentMonthIndex(currentMonthIndex + 1)}
                    disabled={!canMoveForward}
                    className={`p-2 rounded-full transition ${!canMoveForward ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'}`}
                >
                    <FaChevronRight size={16} />
                </button>
            </div>

            <h3 className="font-semibold mb-4 text-left text-gray-700">Select Date</h3>


            <div className="grid grid-cols-7 text-center text-xs font-bold uppercase text-gray-500 mb-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className="p-1">{day}</div>
                ))}
            </div>


            <div className="grid grid-cols-7 gap-1">
                {days.map((dObj) => {
                    const d = dObj.dayjsObject;
                    const dateFormatted = dObj.date;


                    const isPast = d.isBefore(today, "day");


                    const isMonday = d.day() === 1;

                    const isToday = d.isSame(today, 'day');
                    const isSelected = dateFormatted === selectedDate;
                    const isBooked = bookedDateSet.has(dateFormatted);


                    const disabled = isPast || isMonday || dObj.isPadding;


                    let buttonClass = `p-2 rounded-md border text-sm transition text-center h-12 flex flex-col justify-center items-center relative`;

                    if (disabled) {
                        buttonClass += " bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200";
                    } else if (isSelected) {
                        buttonClass += " bg-blue-600 text-white border-blue-600 font-bold shadow-lg transform scale-[1.03]";
                    } else if (isToday) {
                        buttonClass += " bg-blue-50 text-blue-700 border-blue-300 font-medium hover:bg-blue-100";
                    } else if (isBooked) {

                        buttonClass += " bg-yellow-100 text-yellow-800 border-yellow-300 font-medium hover:bg-yellow-200";
                    } else {

                        buttonClass += " bg-white text-gray-700 hover:bg-blue-50 border-gray-300 hover:border-blue-200";
                    }

                    return (
                        <button
                            key={dateFormatted}
                            onClick={() => !disabled && setSelectedDate(dateFormatted)}
                            disabled={disabled}
                            className={buttonClass}
                        >
                            <span className="text-xs md:text-sm">{d.format("D")}</span>
                            {isMonday && <div className="text-[6px] md:text-[9px] font-arial text-red-500 leading-none absolute bottom-0.5">Closed</div>}
                            {isBooked && !disabled && !isSelected && (

                                <div className="absolute top-1 right-1 h-2 w-2 bg-yellow-600 rounded-full border border-white"></div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}