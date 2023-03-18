import { NextPage } from "next";
import { useRouter } from "next/router";
import { useWorkoutService } from "../../services/useWorkoutService";
import WorkoutCard from "../../components/Workout/WorkoutCard/WorkoutCard";
import Header from "../../components/Layout/Header";
import { Rings } from "react-loading-icons";
import WorkoutResultCard from "../../components/WorkoutResult/WorkoutResultCard";
import { AnimatePresence, motion } from "framer-motion";

const Workout: NextPage = () => {
  const router = useRouter();
  const id = parseInt(router.query.id as string, 10);
  const { getWorkoutById } = useWorkoutService();
  const { data: workout, isFetching } = getWorkoutById(id);

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const fadeInUp = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
    },
  };

  return (
    <AnimatePresence>
      {workout ? (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
        >
          <WorkoutCard workout={workout} isFullScreen />
        </motion.div>
      ) : (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          className="flex h-screen w-screen items-center justify-center"
        >
          <Rings />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Workout;
