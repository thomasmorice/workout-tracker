import { NextPage } from "next";
import { useWorkoutSessionService } from "../services/useWorkoutSessionService";
import {
  formatISO,
  startOfMonth,
  endOfMonth,
  isAfter,
  isBefore,
} from "date-fns";
import ScheduleTimeline from "../components/WorkoutSchedule/ScheduleTimeline";
import Calendar from "../components/WorkoutSchedule/Calendar";

export const Schedule: NextPage = () => {
  const { getWorkoutSessions } = useWorkoutSessionService();
  const now = new Date();
  const { data: workoutSessions, isLoading } = getWorkoutSessions({
    dateFilter: {
      gte: formatISO(startOfMonth(now)),
      lte: formatISO(endOfMonth(now)),
    },
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <div className="flex gap-10 flex-wrap">
      <div>
        <div className="mt-4 mb-28 md:mb-8 flex flex-col">
          {workoutSessions
            ?.filter((session) => isAfter(session.date, now))
            .map((session) => {
              return <ScheduleTimeline key={session.id} session={session} />;
            })}
          <ol className="relative border-l border-gray-200 dark:border-gray-700">
            <li className="mb-10 ml-6 font-bold text-xl text-black dark:text-white">
              <div className="absolute w-3 h-3  rounded-full mt-2 -left-1.5 border border-white dark:border-gray-900 bg-primary"></div>
              Today
            </li>
          </ol>
          {workoutSessions
            ?.filter((session) => isBefore(session.date, now))
            .map((session) => {
              return <ScheduleTimeline key={session.id} session={session} />;
            })}
        </div>
      </div>

      <div className="">
        <Calendar />
      </div>
    </div>
  );
};

export default Schedule;
