import { useEffect, useMemo, useState } from "react";
import {
  format,
  startOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isSameDay,
  subMonths,
  addMonths,
} from "date-fns";
import { Rings } from "react-loading-icons";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { useActivityStore } from "../../store/ActivityStore";
import { inferRouterOutputs } from "@trpc/server";
import { EventRouterType } from "../../server/trpc/router/event-router";

interface CalendarProps {
  workoutSessionEvents: inferRouterOutputs<EventRouterType>["getEvents"];
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
  const { currentMonth, set_currentMonth } = useActivityStore();

  useEffect(() => {
    if (selectedDate) {
      handleSelectDate && handleSelectDate(selectedDate);
    } else {
      handleResetSelectDate && handleResetSelectDate();
    }
  }, [selectedDate, handleSelectDate, handleResetSelectDate]);

  const getHeader = () => {
    return (
      <div className="mb-3 flex items-center justify-between">
        <h2 className="h2">{format(currentMonth, "MMMM, yyyy")}</h2>
        <div className="flex gap-3">
          <div
            onClick={() => {
              set_currentMonth(subMonths(currentMonth, 1));
            }}
            className="btn-outline btn btn-sm btn-circle"
          >
            <AiOutlineLeft className="" />
          </div>

          <div
            onClick={() => {
              set_currentMonth(addMonths(currentMonth, 1));
            }}
            className="btn-outline btn btn-sm btn-circle"
          >
            <AiOutlineRight className="navIcon" />
          </div>
        </div>
      </div>
    );
  };

  const getWeekDaysNames = () => {
    const weekStartDate = startOfWeek(currentMonth);
    const weekDays = [];
    for (let day = 0; day < 7; day++) {
      weekDays.push(
        <div key={day} className="p-2">
          {format(addDays(weekStartDate, day), "eee")}
        </div>
      );
    }
    return (
      <div className="grid grid-cols-7 text-center text-xs font-light opacity-80">
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
          className={`relative my-1 flex h-9 cursor-pointer items-center justify-center rounded-full text-sm transition-colors 
            ${day === 0 && ""}
            ${
              isSameMonth(clonedDate, activeDate)
                ? ""
                : "text-base-content opacity-50"
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
            className={`flex h-9 w-9 items-center justify-center rounded-full  text-base-content hover:bg-primary-content  dark:text-accent-content hover:dark:text-primary ${
              isSameDay(currentDate, new Date())
                ? "bg-primary"
                : selectedDate &&
                  isSameDay(currentDate, selectedDate) &&
                  "flex h-9 w-9 bg-primary-content dark:text-primary"
            }`}
          >
            {format(currentDate, "d")}
            <div className="absolute bottom-0.5 left-0 flex w-full justify-center gap-0.5">
              {workoutSessionEvents
                .find((session) => isSameDay(session.eventDate, currentDate))
                ?.workoutSession?.workoutResults.map((result) => {
                  return (
                    <div
                      key={result.id}
                      className={`flex h-1 w-1 items-center justify-end  rounded-full bg-${
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
    const startOfTheSelectedMonth = startOfMonth(currentMonth);
    const endOfTheSelectedMonth = endOfMonth(currentMonth);
    const startDate = startOfWeek(startOfTheSelectedMonth);
    const endDate = startOfWeek(endOfTheSelectedMonth);

    let currentDate = startDate;

    const allWeeks = [];

    while (currentDate <= endDate) {
      allWeeks.push(generateDatesForCurrentWeek(currentDate, currentMonth));
      currentDate = addDays(currentDate, 7);
    }

    return (
      <div className="overflow-hidden rounded-xl">
        <div className="grid grid-cols-7 gap-[1px]">{allWeeks}</div>
      </div>
    );
  };

  if (!currentMonth) return null;
  return (
    <section className={`relative`}>
      {getHeader()}
      {getWeekDaysNames()}
      {getDates()}
      {isLoading && (
        <div className="absolute -top-4 -left-4 flex h-[calc(100%_+_2rem)] w-[calc(100%_+_2rem)] items-center justify-center rounded-xl bg-base-200 bg-opacity-70">
          <Rings className="h-14 w-14" />
        </div>
      )}
    </section>
  );
};

export default Calendar;
