import { zonedTimeToUtc, utcToZonedTime, format } from "date-fns-tz";
import { formatDistance } from "date-fns";
import { WorkoutSession } from "../../server/router/workout-session";
import { enumToString } from "../../utils/formatting";

interface ScheduleTimelineProps {
  session: WorkoutSession;
  isSessionDone?: boolean;
}

export default function ScheduleTimeline({
  session,
  isSessionDone = false,
}: ScheduleTimelineProps) {
  return (
    <ol className="relative border-l border-gray-200 dark:border-gray-700">
      <li className="mb-10 ml-4">
        <div className="absolute w-3 h-3 bg-gray-700 dark:bg-gray-500 rounded-full top-1.5 -left-1.5 border border-white dark:border-gray-900"></div>
        <time className="mb-1 text-sm font-normal leading-none text-gray-500 dark:text-gray-400 ">
          {/* {format(
            zonedTimeToUtc(session.date, "Europe/Stockholm"),
            "LLLL do, u 'at' p"
          )} */}
          {formatDistance(new Date(), new Date(session.date))} ago
        </time>
        {session.workoutResults.length > 0 && (
          <div className="mt-3 mb-12 text-gray-900 dark:text-gray-300  flex w-fit flex-col gap-4 py-5 pl-3 pr-16 bg-gray-600 dark:bg-white bg-opacity-5 dark:bg-opacity-5 rounded-xl border-black dark:border-white border border-opacity-5 dark:border-opacity-5">
            {session.workoutResults.map((result, index) => (
              <div key={index} className="flex items-center gap-3 text-sm">
                <div
                  className={`flex w-1.5 h-1.5 items-center justify-center  rounded-full bg-${
                    !result.workout.difficulty
                      ? "gray-400"
                      : result.workout.difficulty === "BLACK"
                      ? "black"
                      : `${result.workout.difficulty?.toLowerCase()}-500`
                  } text-xs`}
                ></div>
                <div className="opacity-70">
                  {result.workout.totalTime && `${result.workout.totalTime}mn `}
                  <span className="lowercase">
                    {`${enumToString(result.workout.elementType)}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </li>
    </ol>
  );
}
