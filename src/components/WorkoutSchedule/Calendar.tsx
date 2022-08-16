import { useMemo, useState } from "react";
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
import { WorkoutSession } from "../../server/router/workout-session";
import { now } from "next-auth/client/_utils";

interface CalendarProps {
  workoutSessions: WorkoutSession[];
  handleGoToPreviousMonth: () => void;
  handleGoToNextMonth: () => void;
  date?: Date;
}

const Calendar = ({
  workoutSessions,
  handleGoToPreviousMonth,
  handleGoToNextMonth,
  date,
}: CalendarProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeDate, setActiveDate] = useState(date ?? new Date());

  const getHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <div
          onClick={() => {
            handleGoToPreviousMonth();
            setActiveDate(subMonths(activeDate, 1));
          }}
          className="btn btn-sm btn-square btn-ghost"
        >
          <AiOutlineLeft className="" />
        </div>
        <h2 className="font-semibold text-black dark:text-white">
          {format(activeDate, "MMMM yyyy")}
        </h2>
        <div
          onClick={() => {
            handleGoToNextMonth();
            setActiveDate(addMonths(activeDate, 1));
          }}
          className="btn btn-sm btn-square btn-ghost"
        >
          <AiOutlineRight className="navIcon" />
        </div>
      </div>
    );
  };

  const getWeekDaysNames = () => {
    const weekStartDate = startOfWeek(activeDate);
    const weekDays = [];
    for (let day = 0; day < 7; day++) {
      weekDays.push(
        <div key={day} className="p-2">
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
          id={`${format(currentDate, "w")}-${day}`}
          key={`${format(currentDate, "w")}-${day}`}
          className={`relative cursor-pointer text-sm h-10 w-10 leading-none flex items-center justify-center hover:bg-gray-100 hover:dark:bg-gray-600 transition-colors 
            ${day === 0 && ""}
            ${
              isSameMonth(currentDate, activeDate)
                ? "bg-white dark:bg-base-100 dark:bg-opacity-80 "
                : "text-opacity-30 bg-gray-100 dark:bg-base-300 text-base-content"
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
                ? "p-1.5 bg-black dark:bg-white rounded-full text-white dark:text-black"
                : ""
            }`}
          >
            {format(currentDate, "d")}
            <div className="absolute bottom-0.5 left-0 w-full gap-1 flex justify-center">
              {workoutSessions
                .find((session) => isSameDay(session.date, currentDate))
                ?.workoutResults.map((result) => {
                  return (
                    <div
                      key={result.id}
                      className={`flex w-1 h-1 items-center justify-end  rounded-full bg-${
                        !result.workout.difficulty
                          ? "gray-400"
                          : result.workout.difficulty === "BLACK"
                          ? "black"
                          : `${result.workout.difficulty?.toLowerCase()}-500`
                      } text-xs`}
                    ></div>
                  );
                })}
            </div>
          </div>
        </div>
      );
      currentDate = addDays(currentDate, 1);
    }
    return week;
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
      <div className="border-opacity-80 border shadow-sm  dark:border-gray-700 rounded-xl overflow-hidden">
        <div className="grid grid-cols-7 gap-[1px] bg-base-300 dark:bg-gray-700">
          {allWeeks}
        </div>
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
