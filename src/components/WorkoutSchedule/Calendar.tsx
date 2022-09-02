import { useEffect, useMemo, useState } from "react";
import {
  format,
  startOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  isSameMonth,
  isSameDay,
  subYears,
  addYears,
  subMonths,
  addMonths,
  subDays,
} from "date-fns";
import { Rings } from "react-loading-icons";
import {
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineDoubleRight,
  AiOutlineDoubleLeft,
} from "react-icons/ai";
import { WorkoutSession } from "../../server/router/workout-session";

interface CalendarProps {
  workoutSessions: WorkoutSession[];
  handleGoToPreviousYear: () => void;
  handleGoToPreviousMonth: () => void;
  handleGoToNextMonth: () => void;
  handleGoToNextYear: () => void;
  handleSelectDate: (date: Date) => void;
  handleResetSelectDate: () => void;
  date?: Date;
  isLoading: boolean;
}

const Calendar = ({
  workoutSessions,
  handleGoToPreviousYear,
  handleGoToPreviousMonth,
  handleGoToNextMonth,
  handleGoToNextYear,
  handleSelectDate,
  handleResetSelectDate,
  date,
  isLoading,
}: CalendarProps) => {
  const [selectedDate, set_selectedDate] = useState<Date | undefined>();
  const [activeDate, set_activeDate] = useState(date ?? new Date());

  useEffect(() => {
    if (selectedDate) {
      handleSelectDate(selectedDate);
    } else {
      handleResetSelectDate();
    }
  }, [selectedDate, handleSelectDate, handleResetSelectDate]);

  const getHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <div>
          <div
            onClick={() => {
              handleGoToPreviousYear();
              set_activeDate(subYears(activeDate, 1));
            }}
            className="btn btn-sm btn-square btn-ghost"
          >
            <AiOutlineDoubleLeft className="" />
          </div>
          <div
            onClick={() => {
              handleGoToPreviousMonth();
              set_activeDate(subMonths(activeDate, 1));
            }}
            className="btn btn-sm btn-square btn-ghost"
          >
            <AiOutlineLeft className="" />
          </div>
        </div>
        <h2 className="font-semibold text-black dark:text-white">
          {format(activeDate, "MMMM yyyy")}
        </h2>
        <div>
          <div
            onClick={() => {
              handleGoToNextMonth();
              set_activeDate(addMonths(activeDate, 1));
            }}
            className="btn btn-sm btn-square btn-ghost"
          >
            <AiOutlineRight className="navIcon" />
          </div>
          <div
            onClick={() => {
              handleGoToNextYear();
              set_activeDate(addYears(activeDate, 1));
            }}
            className="btn btn-sm btn-square btn-ghost"
          >
            <AiOutlineDoubleRight className="" />
          </div>
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

  const generateDatesForCurrentWeek = (date: Date, activeDate: Date) => {
    let currentDate = date;
    const week = [];
    for (let day = 0; day < 7; day++) {
      let clonedDate = addDays(date, day);
      week.push(
        <div
          key={`${format(currentDate, "w")}-${day}`}
          className={`relative cursor-pointer text-sm h-10 w-10 leading-none flex items-center justify-center hover:bg-gray-100 hover:dark:bg-gray-600 transition-colors 
            ${day === 0 && ""}
            ${
              isSameMonth(clonedDate, activeDate)
                ? "bg-base-100"
                : "text-opacity-20 bg-opacity-5 bg-base-content text-base-content"
            } 
            ${
              selectedDate && isSameDay(clonedDate, selectedDate)
                ? // ? "bg-gray-200 hover:bg-gray-200 dark:bg-gray-800 hover:dark:bg-gray-800"
                  "bg-neutral-focus hover:bg-neutral-focus text-neutral-content"
                : "no-selected"
            }
          `}
          onClick={() =>
            !selectedDate ||
            clonedDate.toDateString() !== selectedDate.toDateString()
              ? set_selectedDate(clonedDate)
              : set_selectedDate(undefined)
          }
        >
          <div
            className={`${
              isSameDay(currentDate, new Date())
                ? "flex w-5 h-5 bg-black dark:bg-white rounded-full text-white dark:text-black items-center justify-center"
                : ""
            }`}
          >
            {format(currentDate, "d")}
            <div className="absolute bottom-0.5 left-0 w-full gap-1 flex justify-center">
              {workoutSessions
                .find((session) => isSameDay(session.date, currentDate))
                ?.workoutResults.map((result) => {
                  // console.log("result", result);
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
    const startDate = subDays(startOfWeek(startOfTheSelectedMonth), 0);
    const endDate = addDays(endOfWeek(endOfTheSelectedMonth), 0);

    let currentDate = startDate;

    const allWeeks = [];

    while (currentDate <= endDate) {
      allWeeks.push(generateDatesForCurrentWeek(currentDate, activeDate));
      currentDate = addDays(currentDate, 7);
    }

    return (
      <div className="border shadow-sm  border-base-content border-opacity-10 rounded-xl overflow-hidden">
        <div className="grid grid-cols-7 gap-[1px] bg-base-300">{allWeeks}</div>
      </div>
    );
  };

  return (
    <section className="relative">
      {getHeader()}

      {getWeekDaysNames()}
      {getDates()}
      {isLoading && (
        <div className="absolute bg-base-300 h-full w-full top-0 bg-opacity-70 rounded-xl flex items-center justify-center">
          <Rings className="w-14 h-14" />
        </div>
      )}
    </section>
  );
};

export default Calendar;
