import {
  formatISO,
  addDays,
  subDays,
  format,
  isSameDay,
  startOfDay,
  endOfDay,
} from "date-fns";
import { LayoutGroup, motion } from "framer-motion";
import { useState } from "react";
import { trpc } from "../../utils/trpc";
import WorkoutCard from "./WorkoutCard/WorkoutCard";

export default function WeeklyBoxWorkouts() {
  const workoutContainerVariant = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const workoutItemVariant = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

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
      <div className="mx-auto -ml-4 flex w-[calc(100%_+_2rem)] justify-start overflow-x-scroll px-2 py-3  text-base-content  shadow-md md:mx-12 md:justify-center">
        {getAllWeeks().map((day, index) => (
          <motion.div
            layout
            key={index}
            className={`group relative mx-1 flex w-16 cursor-pointer justify-center rounded-lg`}
          >
            {isSameDay(day, selectedDay) && (
              <motion.div
                layoutId="selected-day-in-the-box"
                className="absolute -z-10 h-full w-full rounded-lg bg-white"
              ></motion.div>
            )}
            {/* {isToday(day) && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3 ">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white "></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-white"></span>
              </span>
            )} */}
            <div
              onClick={() => set_selectedDay(day)}
              className="flex items-center px-2 py-2"
            >
              <div className="flex flex-col items-center gap-2 mix-blend-exclusion">
                <p className=" text-xs">{format(day, "ccc")}</p>
                <p className="text-sm font-medium ">{format(day, "dd")}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* <h2 className="mt-6 text-2xl font-bold">
        {isToday(selectedDay)
          ? "Today"
          : isTomorrow(selectedDay)
          ? "Tomorrow"
          : format(selectedDay, "eeee")}
      </h2> */}

      <motion.div
        key={selectedDay.toString()}
        variants={workoutContainerVariant}
        initial="hidden"
        animate="show"
        className="mt-10 flex flex-col gap-10"
      >
        <LayoutGroup>
          {data?.pages[0]?.workouts.map(
            (workout) =>
              workout.affiliateDate &&
              isSameDay(workout.affiliateDate, selectedDay) && (
                <motion.div key={workout.id}>
                  <WorkoutCard workout={workout} />
                </motion.div>
              )
          )}
        </LayoutGroup>
      </motion.div>
    </>
  );
}
