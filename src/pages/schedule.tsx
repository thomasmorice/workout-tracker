import { NextPage } from "next";
import { useWorkoutSessionService } from "../services/useWorkoutSessionService";
import {
  formatISO,
  startOfMonth,
  endOfMonth,
  isBefore,
  isAfter,
} from "date-fns";
import { zonedTimeToUtc, utcToZonedTime, format } from "date-fns-tz";
import { MdCalendarToday } from "react-icons/md";

export const Schedule: NextPage = () => {
  const { getWorkoutSessions } = useWorkoutSessionService();
  const now = new Date();
  const { data: workoutSessions } = getWorkoutSessions({
    dateFilter: {
      gte: formatISO(startOfMonth(now)),
      lte: formatISO(endOfMonth(now)),
    },
  });
  return (
    <div>
      <div className="mt-4 p-4 bg-base-300 rounded-md">
        <h1 className="font-semibold text-2xl">Monthly sessions</h1>
        <div className="mt-4 flex flex-col gap-3">
          {workoutSessions
            ?.filter((session) => isAfter(session.date, now))
            .map((session) => (
              <div key={session.id}>
                <h2>Upcoming sessions</h2>
                <div className="flex opacity-60 items-center gap-2">
                  <MdCalendarToday size={20} />
                  <div className="font-light text-sm ">
                    {format(
                      zonedTimeToUtc(session.date, "Europe/Stockholm"),
                      "LLLL do, u 'at' p"
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
