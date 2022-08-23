import { zonedTimeToUtc, utcToZonedTime, format } from "date-fns-tz";
import { formatDistance, intlFormat } from "date-fns";
import { WorkoutSession } from "../../server/router/workout-session";
import { enumToString } from "../../utils/formatting";
import Link from "next/link";

interface ScheduleTimelineProps {
  session: WorkoutSession;
  isSessionDone?: boolean;
}

export default function ScheduleTimeline({
  session,
  isSessionDone = true,
}: ScheduleTimelineProps) {
  return (
    <ol className="relative border-l border-gray-200 dark:border-gray-700">
      <li className="mb-10 ml-4">
        <div className="absolute w-3 h-3 bg-gray-700 dark:bg-gray-500 rounded-full top-2.5 -left-1.5 border border-white dark:border-gray-900"></div>
        <time className="mb-1 text-sm flex flex-col gap-1 justify-center font-normal leading-none text-gray-500 dark:text-gray-400 ">
          <div>
            {format(
              zonedTimeToUtc(session.date, "Europe/Stockholm"),
              "LLLL do, u 'at' p"
            )}
          </div>
          <div className="text-xs flex items-center gap-2">
            {!isSessionDone && "In"}{" "}
            {formatDistance(new Date(), new Date(session.date))}{" "}
            {isSessionDone && "ago"}
          </div>
        </time>
        {session.workoutResults.length > 0 ? (
          <>
            <div className="mt-5 flex gap-3 items-center">
              {isSessionDone && (
                <a className=" underline cursor-pointer text-xs">
                  Manage results
                </a>
              )}

              <a className="underline cursor-pointer text-xs">delete session</a>
            </div>

            <div className="mt-3 mb-12 text-gray-900 dark:text-gray-300  flex w-fit flex-col gap-6 py-5 px-3 bg-gray-600 dark:bg-white bg-opacity-5 dark:bg-opacity-5 rounded-xl border-black dark:border-white border border-opacity-5 dark:border-opacity-5">
              {session.workoutResults.map((result, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 ">
                    <div
                      className={`flex w-1.5 h-1.5 items-center justify-center  rounded-full ${
                        !result.workout.difficulty
                          ? "bg-gray-400"
                          : result.workout.difficulty === "BLACK"
                          ? "bg-black"
                          : `bg-${result.workout.difficulty?.toLowerCase()}-500`
                      } text-xs`}
                    ></div>
                    <div className="">
                      {result.workout.totalTime &&
                        `${result.workout.totalTime}mn `}
                      <span className="lowercase">
                        {`${enumToString(result.workout.elementType)}`}
                      </span>
                    </div>
                  </div>
                  <p className="whitespace-pre-wrap opacity-70 text-[0.85rem] pl-5">
                    {result.description}
                  </p>
                  {/* <button className="mt-2 btn btn-sm mx-3 btn-outline">
                  Edit
                </button> */}
                </div>
              ))}
            </div>
          </>
        ) : (
          <Link href={`/session/edit/${session.id}`}>
            <a className="underline cursor-pointer text-xs">Add results</a>
          </Link>
        )}
      </li>
    </ol>
  );
}