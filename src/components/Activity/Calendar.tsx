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
  subMonths,
  addMonths,
  subDays,
} from "date-fns";
import { Rings } from "react-loading-icons";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { useSidebarStore } from "../../store/SidebarStore";
import { InferQueryOutput } from "../../types/trpc";

interface CalendarProps {
  workoutSessionEvents: InferQueryOutput<"event.get-events">;
  handleSelectDate?: (date: Date) => void;
  handleResetSelectDate?: () => void;
  date?: Date;
  isLoading: boolean;
}

const Calendar = ({
  workoutSessionEvents,
  handleSelectDate,
  handleResetSelectDate,
  isLoading,
}: CalendarProps) => {
  const [selectedDate, set_selectedDate] = useState<Date | undefined>();
  const { currentVisibleDate, set_currentVisibleDate } = useSidebarStore();

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
        <div className="flex gap-3">
          <div
            onClick={() => {
              set_currentVisibleDate(subMonths(currentVisibleDate, 1));
            }}
            className="btn btn-sm btn-circle btn-outline"
          >
            <AiOutlineLeft className="" />
          </div>

          <div
            onClick={() => {
              set_currentVisibleDate(addMonths(currentVisibleDate, 1));
            }}
            className="btn btn-sm btn-circle btn-outline"
          >
            <AiOutlineRight className="navIcon" />
          </div>
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
          className={`relative cursor-pointer text-sm rounded-full h-9 my-1 flex items-center justify-center transition-colors 
            ${day === 0 && ""}
            ${isSameMonth(clonedDate, activeDate) ? "" : "text-base-content"} 
          `}
          onClick={() =>
            !selectedDate ||
            clonedDate.toDateString() !== selectedDate.toDateString()
              ? set_selectedDate(clonedDate)
              : set_selectedDate(undefined)
          }
        >
          <div
            className={`flex w-9 h-9 rounded-full text-base-content dark:text-accent-content  items-center justify-center  hover:bg-primary-content hover:dark:text-primary ${
              isSameDay(currentDate, new Date())
                ? "bg-primary"
                : selectedDate &&
                  isSameDay(currentDate, selectedDate) &&
                  "flex w-7 h-7 bg-primary-content dark:text-primary"
            }`}
          >
            {format(currentDate, "d")}
            <div className="absolute bottom-0.5 left-0 w-full gap-0.5 flex justify-center">
              {workoutSessionEvents
                .find((session) => isSameDay(session.eventDate, currentDate))
                ?.workoutSession?.workoutResults.map((result) => {
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
      <div className="rounded-xl overflow-hidden">
        <div className="grid grid-cols-7 gap-[1px]">{allWeeks}</div>
      </div>
    );
  };

  if (!currentVisibleDate) return null;
  return (
    <section className={`relative`}>
      {getHeader()}
      {getWeekDaysNames()}
      {getDates()}
      {isLoading && (
        <div className="absolute h-[calc(100%_+_2rem)] w-[calc(100%_+_2rem)] -top-4 -left-4 bg-opacity-70 bg-base-200 rounded-xl flex items-center justify-center">
          <Rings className="w-14 h-14" />
        </div>
      )}
    </section>
  );
};

export default Calendar;
