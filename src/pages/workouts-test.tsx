import { motion } from "framer-motion";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import WorkoutCard from "../components/Workout/WorkoutCardTest/WorkoutCard";
import { useWorkoutService } from "../services/useWorkoutService";

const Workouts: NextPage = () => {
  const { data: sessionData } = useSession();

  const { getInfiniteWorkouts } = useWorkoutService();

  const { data, fetchNextPage, hasNextPage, isFetching, isSuccess, ...rest } =
    getInfiniteWorkouts({});

  const [classifiedOnly, set_classifiedOnly] = useState(true);
  return (
    <>
      <div className="mt-80">
        <motion.div layout>
          {data?.pages[0]?.workouts[0] && (
            <WorkoutCard workout={data?.pages[0]?.workouts[0]} />
          )}
        </motion.div>
      </div>
    </>
  );
};

export default Workouts;
