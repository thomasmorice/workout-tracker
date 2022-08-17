import { NextPage } from "next";
import { useWorkoutSessionService } from "../services/useWorkoutSessionService";
import {
  formatISO,
  startOfMonth,
  endOfMonth,
  isAfter,
  isBefore,
  subMonths,
  addMonths,
  isSameDay,
  getMonth,
  isSameMonth,
  format,
} from "date-fns";
import ScheduleTimeline from "../components/WorkoutSchedule/ScheduleTimeline";
import Calendar from "../components/WorkoutSchedule/Calendar";
import { useState } from "react";
import { WorkoutSession } from "../server/router/workout-session";

export const Schedule: NextPage = () => {
  const { getWorkoutSessions } = useWorkoutSessionService();
  const now = new Date();
  const [currentVisibleMonthDate, set_currentVisibleMonthDate] = useState(now);
  const [selectedSession, set_selectedSession] = useState<
    undefined | WorkoutSession | -1
  >();

  const { data: workoutSessions, isLoading } = getWorkoutSessions({
    dateFilter: {
      gte: formatISO(startOfMonth(currentVisibleMonthDate)),
      lte: formatISO(endOfMonth(currentVisibleMonthDate)),
    },
  });

  if (isLoading || !workoutSessions) {
    return <p>Loading...</p>;
  }
  return (
    <div className="flex mt-10 gap-10 flex-wrap lg:flex-nowrap justify-center md:justify-start">
      <div className="flex lg:sticky top-16 self-start lg:min-w-[320px]">
        {workoutSessions && (
          <div className="flex flex-col gap-6">
            <Calendar
              date={currentVisibleMonthDate}
              handleSelectDate={(date) =>
                set_selectedSession(
                  workoutSessions.find((session) =>
                    isSameDay(session.date, date)
                  ) ?? -1
                )
              }
              handleResetSelectDate={() => set_selectedSession(undefined)}
              handleGoToPreviousMonth={() => {
                set_currentVisibleMonthDate(
                  subMonths(currentVisibleMonthDate, 1)
                );
              }}
              handleGoToNextMonth={() => {
                set_currentVisibleMonthDate(
                  addMonths(currentVisibleMonthDate, 1)
                );
              }}
              workoutSessions={workoutSessions}
            />
            <button className="btn btn-primary btn-sm">
              Plan a new session
            </button>
          </div>
        )}
      </div>

      <div className="max-w-lg">
        <div className="mt-4 sm:mt-0 mb-28 md:mb-8 flex flex-col">
          {!selectedSession ? (
            <>
              {workoutSessions
                ?.filter((session) => isAfter(session.date, now))
                .map((session) => {
                  return (
                    <ScheduleTimeline key={session.id} session={session} />
                  );
                })}
              <ol className="relative border-l border-gray-200 dark:border-gray-700">
                <li className="mb-10 ml-6 font-bold text-xl text-black dark:text-white">
                  <div className="absolute w-3 h-3  rounded-full mt-2 -left-1.5 border border-white dark:border-gray-900 bg-primary"></div>
                  {isSameMonth(currentVisibleMonthDate, now)
                    ? "Today"
                    : format(currentVisibleMonthDate, "MMMM")}
                </li>
              </ol>
              {workoutSessions
                ?.filter((session) => isBefore(session.date, now))
                .map((session) => {
                  return (
                    <ScheduleTimeline key={session.id} session={session} />
                  );
                })}
            </>
          ) : (
            <>
              {selectedSession !== -1 ? (
                <div className="flex flex-col gap-5">
                  <ScheduleTimeline session={selectedSession} />
                  {/* <button className="btn">Edit this session</button> */}
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  <p>No session on this day</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
