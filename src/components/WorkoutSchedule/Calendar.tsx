import { useState } from "react";
import {
  format,
  startOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  isSameMonth,
  isSameDay,
  subMonths,
  addMonths,
  subDays,
} from "date-fns";

import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

// interface CalendarProps

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeDate, setActiveDate] = useState(new Date());

  const getHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <div className="btn btn-sm btn-square btn-ghost">
          <AiOutlineLeft
            className=""
            onClick={() => setActiveDate(subMonths(activeDate, 1))}
          />
        </div>
        <h2 className="font-semibold text-black dark:text-white">
          {format(activeDate, "MMMM yyyy")}
        </h2>
        <div className="btn btn-sm btn-square btn-ghost">
          <AiOutlineRight
            className="navIcon"
            onClick={() => setActiveDate(addMonths(activeDate, 1))}
          />
        </div>
      </div>
    );
  };

  const getWeekDaysNames = () => {
    const weekStartDate = startOfWeek(activeDate);
    const weekDays = [];
    for (let day = 0; day < 7; day++) {
      weekDays.push(
        <div className="bg-white p-2">
          {format(addDays(weekStartDate, day), "EEEEE")}
        </div>
      );
    }
    return (
      <div className="grid grid-cols-7 text-xs font-medium text-center opacity-50">
        {weekDays}
      </div>
    );
  };

  const generateDatesForCurrentWeek = (
    date: Date,
    selectedDate: Date,
    activeDate: Date
  ) => {
    let currentDate = date;
    const week = [];
    for (let day = 0; day < 7; day++) {
      const cloneDate = currentDate;
      week.push(
        <div
          // className={`day border-b border-x -mb-[1px] -ml-[1px] p-2 border-base-content border-opacity-50
          className={`cursor-pointer text-sm h-10 w-10 leading-none flex items-center justify-center 
            ${day === 0 && ""}
            ${
              isSameMonth(currentDate, activeDate)
                ? "bg-white hover:bg-gray-100 transition-colors"
                : "text-opacity-30 bg-gray-100 text-base-content"
            } 
            ${isSameDay(currentDate, selectedDate) ? "bg-" : ""}
            
          `}
          onClick={() => {
            setSelectedDate(cloneDate);
          }}
        >
          <div
            className={`${
              isSameDay(currentDate, new Date())
                ? "p-2 bg-black rounded-full text-white"
                : ""
            }`}
          >
            {format(currentDate, "d")}
          </div>
        </div>
      );
      currentDate = addDays(currentDate, 1);
    }
    return <>{week}</>;
  };

  const getDates = () => {
    const startOfTheSelectedMonth = startOfMonth(activeDate);
    const endOfTheSelectedMonth = endOfMonth(activeDate);
    const startDate = subDays(startOfWeek(startOfTheSelectedMonth), 4);
    const endDate = addDays(endOfWeek(endOfTheSelectedMonth), 3);

    let currentDate = startDate;

    const allWeeks = [];

    while (currentDate <= endDate) {
      allWeeks.push(
        generateDatesForCurrentWeek(currentDate, selectedDate, activeDate)
      );
      currentDate = addDays(currentDate, 7);
    }

    return (
      <div className="border-opacity-80 border shadow-sm rounded-lg">
        <div className="grid grid-cols-7 gap-[1px] bg-base-300">{allWeeks}</div>
      </div>
    );
  };

  return (
    <section className="">
      {getHeader()}
      {getWeekDaysNames()}
      {getDates()}
    </section>
  );
};

export default Calendar;
