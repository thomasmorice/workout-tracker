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
import { useScheduleStore } from "../../store/ScheduleStore";
import { InferQueryOutput } from "../../types/trpc";

interface CalendarProps {
  workoutSessions: InferQueryOutput<"workout-session.get-workout-sessions">;
  handleSelectDate?: (date: Date) => void;
  handleResetSelectDate?: () => void;
  date?: Date;
  isLoading: boolean;
}

const Calendar = ({
  workoutSessions,
  handleSelectDate,
  handleResetSelectDate,
  isLoading,
}: CalendarProps) => {
  const [selectedDate, set_selectedDate] = useState<Date | undefined>();
  const { currentVisibleDate, set_currentVisibleDate } = useScheduleStore();

  useEffect(() => {
    if (selectedDate) {
      handleSelectDate && handleSelectDate(selectedDate);
    } else {
      handleResetSelectDate && handleResetSelectDate();
    }
  }, [selectedDate, handleSelectDate, handleResetSelectDate]);

  const getHeader = () => {
    return (
      <div className="flex items-center justify-between mb-1">
        <h2 className="h2">{format(currentVisibleDate, "MMMM, yyyy")}</h2>
        <div className="flex gap-2">
          {/* <div
            onClick={() => {
              set_currentVisibleDate(subYears(currentVisibleDate, 1));
            }}
            className="btn btn-xs btn-square"
          >
            <AiOutlineDoubleLeft className="" />
          </div> */}
          <div
            onClick={() => {
              set_currentVisibleDate(subMonths(currentVisibleDate, 1));
            }}
            className="btn btn-xs btn-circle btn-outline"
          >
            <AiOutlineLeft className="" />
          </div>

          <div
            onClick={() => {
              set_currentVisibleDate(addMonths(currentVisibleDate, 1));
            }}
            className="btn btn-xs btn-circle btn-outline"
          >
            <AiOutlineRight className="navIcon" />
          </div>
          {/* <div
            onClick={() => {
              set_currentVisibleDate(addYears(currentVisibleDate, 1));
            }}
            className="btn btn-xs btn-square"
          >
            <AiOutlineDoubleRight className="" />
          </div> */}
        </div>
      </div>
    );
  };

  const getWeekDaysNames = () => {
    const weekStartDate = startOfWeek(currentVisibleDate);
    const weekDays = [];
    for (let day = 0; day < 7; day++) {
      weekDays.push(
        <div key={day} className="p-2">
          {format(addDays(weekStartDate, day), "eee")}
        </div>
      );
    }
    return (
      <div className="grid grid-cols-7 text-2xs font-light text-center opacity-80">
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
          className={`relative cursor-pointer text-sm rounded-full h-11 w-11 flex items-center justify-center hover:bg-gray-100 hover:dark:bg-gray-600 transition-colors text-accent-content 
            ${day === 0 && ""}
            ${
              isSameMonth(clonedDate, activeDate)
                ? ""
                : "text-opacity-40 bg-opacity-5 text-base-content"
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
                ? "flex w-6 h-6 bg-accent-content rounded-full text-primary items-center justify-center"
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
    const startOfTheSelectedMonth = startOfMonth(currentVisibleDate);
    const endOfTheSelectedMonth = endOfMonth(currentVisibleDate);
    const startDate = subDays(startOfWeek(startOfTheSelectedMonth), 0);
    const endDate = addDays(endOfWeek(endOfTheSelectedMonth), 0);

    let currentDate = startDate;

    const allWeeks = [];

    while (currentDate <= endDate) {
      allWeeks.push(
        generateDatesForCurrentWeek(currentDate, currentVisibleDate)
      );
      currentDate = addDays(currentDate, 7);
    }

    return (
      <div className="shadow-sm  border-base-content border-opacity-10 rounded-xl overflow-hidden">
        <div className="grid grid-cols-7 gap-[1px]">{allWeeks}</div>
      </div>
    );
  };

  if (!currentVisibleDate) return null;
  return (
    <section className="relative">
      {getHeader()}
      {getWeekDaysNames()}
      {getDates()}
      {isLoading && (
        <div className="absolute h-full w-full top-0 bg-opacity-70 rounded-xl flex items-center justify-center">
          <Rings className="w-14 h-14" />
        </div>
      )}
    </section>
  );
};

export default Calendar;
