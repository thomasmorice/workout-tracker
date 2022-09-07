import { NextPage } from "next";
import { useWorkoutSessionService } from "../services/useWorkoutSessionService";
import {
  formatISO,
  startOfMonth,
  endOfMonth,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  format,
} from "date-fns";
import ScheduleTimeline from "../components/WorkoutSchedule/ScheduleTimeline";
import Calendar from "../components/WorkoutSchedule/Calendar";
import { useState } from "react";
import Link from "next/link";
import { useScheduleStore } from "../store/ScheduleStore";
import { InferQueryOutput } from "../types/trpc";

export const Schedule: NextPage = () => {
  const { getWorkoutSessions } = useWorkoutSessionService();
  const now = new Date();
  const { currentVisibleDate, set_currentVisibleDate } = useScheduleStore();
  const [selectedSession, set_selectedSession] = useState<
    | undefined
    | InferQueryOutput<"workout-session.get-workout-sessions">[number]
    | -1
  >();

  const { data: workoutSessions, isLoading } = getWorkoutSessions({
    dateFilter: {
      gte: formatISO(startOfMonth(currentVisibleDate)),
      lte: formatISO(endOfMonth(currentVisibleDate)),
    },
  });

  return (
    <div className="flex mt-10 gap-10 flex-wrap lg:flex-nowrap justify-center md:justify-start">
      <div className="flex lg:sticky top-16 self-start lg:min-w-[320px]">
        <div className="flex flex-col gap-6">
          <Calendar
            handleSelectDate={(date) =>
              set_selectedSession(
                workoutSessions?.find((session) =>
                  isSameDay(session.date, date)
                ) ?? -1
              )
            }
            handleResetSelectDate={() => set_selectedSession(undefined)}
            workoutSessions={workoutSessions ?? []}
            isLoading={isLoading}
          />
          <Link href={"/session/add"}>
            <a className="btn btn-primary btn-sm">Plan a new session</a>
          </Link>
        </div>
      </div>

      <div className="w-[288px]">
        <h2 className="h2">Activity</h2>
        <div className="mt-4 sm:mt-0 mb-28 md:mb-8 flex flex-col">
          {!selectedSession ? (
            <>
              {workoutSessions
                ?.filter((session) => isAfter(session.date, now))
                .map((session) => {
                  return (
                    <ScheduleTimeline
                      isSessionDone={false}
                      key={session.id}
                      session={session}
                    />
                  );
                })}
              <ol className="relative border-l border-gray-200 dark:border-gray-700">
                <li className="mb-10 ml-6  text-black dark:text-white">
                  <div className="absolute w-3 h-3  rounded-full mt-2 -left-1.5 border border-white dark:border-gray-900 bg-primary"></div>
                  {isSameMonth(currentVisibleDate, now) ? (
                    "Today"
                  ) : (
                    <div>
                      <div className="font-bold text-xl">
                        {format(currentVisibleDate, "MMMM yyyy")}
                      </div>
                      <div
                        onClick={() => set_currentVisibleDate(now)}
                        className="text-xs link text-base-content"
                      >
                        Go back to current month
                      </div>
                    </div>
                  )}
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
                  <ScheduleTimeline
                    isSessionDone={isBefore(selectedSession.date, now)}
                    session={selectedSession}
                  />
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
