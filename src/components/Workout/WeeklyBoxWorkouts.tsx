import {
  formatISO,
  addDays,
  subDays,
  format,
  isSameDay,
  isToday,
  formatDistance,
  isTomorrow,
  startOfDay,
  endOfDay,
} from "date-fns";
import { useState } from "react";
import { trpc } from "../../utils/trpc";
import WorkoutCard from "./WorkoutCard/WorkoutCard";

export default function WeeklyBoxWorkouts() {
  const weekDays = {
    start: startOfDay(subDays(new Date(), 2)),
    end: endOfDay(addDays(new Date(), 5)),
  };

  const [selectedDay, set_selectedDay] = useState(new Date());

  const { data, isFetching, isSuccess } =
    trpc.workout.getInfiniteWorkout.useInfiniteQuery(
      {
        affiliateOnly: true,
        limit: 50,
        dateFilter: {
          gte: formatISO(weekDays.start),
          lte: formatISO(weekDays.end),
        },
      },
      {
        getNextPageParam: (lastPage, allPages) => lastPage.nextCursor,
      }
    );

  const getAllWeeks = () => {
    let currentDate = weekDays.start;
    const allWeeks = [];
    while (currentDate <= weekDays.end) {
      allWeeks.push(currentDate);
      currentDate = addDays(currentDate, 1);
    }
    return allWeeks;
  };
  return (
    <>
      <div className="mx-auto -ml-4 flex w-[calc(100%_+_2rem)] justify-start overflow-x-scroll py-3 px-2  text-base-content  shadow-md md:mx-12 md:justify-center">
        {getAllWeeks().map((day, index) => (
          <div
            key={index}
            className={`group relative mx-1 flex w-16 cursor-pointer justify-center rounded-lg 
                ${
                  isSameDay(day, selectedDay)
                    ? "bg-primary-focus text-primary-content"
                    : ""
                }
              `}
          >
            {isToday(day) && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3 ">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary "></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-primary"></span>
              </span>
            )}
            <div
              onClick={() => set_selectedDay(day)}
              className="flex items-center px-3 py-2"
            >
              <div className="text-center">
                <p className="text-xs font-black ">{format(day, "dd")}</p>
                <p className=" text-sm ">{format(day, "ccc")}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-6 text-xl font-semibold">
        {`
        ${
          isToday(selectedDay)
            ? "Today"
            : isTomorrow(selectedDay)
            ? "Tomorrow"
            : format(selectedDay, "eeee")
        } 
        at your box`}
      </h2>

      <div className="mt-6 flex flex-col gap-6">
        {data?.pages[0]?.workouts.map(
          (workout) =>
            isSameDay(workout.createdAt, selectedDay) && (
              <WorkoutCard key={workout.id} workout={workout} />
            )
        )}
      </div>
    </>
  );
}
