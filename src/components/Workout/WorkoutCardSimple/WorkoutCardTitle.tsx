import { inferRouterOutputs } from "@trpc/server";
import { motion } from "framer-motion";
import { BsLightningChargeFill } from "react-icons/bs";
import { GiBiceps } from "react-icons/gi";
import { FaRunning } from "react-icons/fa";
import { WorkoutRouterType } from "../../../server/trpc/router/workout-router";
import { enumToString } from "../../../utils/formatting";

type WorkoutCardTitleProps = {
  mode: "minified" | "expanded" | "full-screen";
  workout:
    | inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number]
    | inferRouterOutputs<WorkoutRouterType>["getWorkoutById"];
};

export default function WorkoutCardTitle({
  workout,
  mode,
}: WorkoutCardTitleProps) {
  return (
    <motion.div
      layout="position"
      className={`
        flex flex-col items-center font-bold
        ${
          mode === "full-screen"
            ? "mt-6"
            : mode === "expanded"
            ? "mt-2"
            : "-mt-8"
        }
      `}
    >
      <motion.div
        className={`
        flex items-center gap-1.5 text-center  font-semibold tracking-[0.03rem]
        ${mode === "full-screen" ? "text-sm" : "text-xs"}
        `}
      >
        {workout.elementType.includes("STRENGTH") && <GiBiceps size={14} />}
        {workout.elementType.includes("WOD") && (
          <BsLightningChargeFill size={14} />
        )}
        {workout.elementType.includes("ENDURANCE") && <FaRunning size={14} />}
        {enumToString(workout.elementType)}
      </motion.div>
      <motion.div
        className={`
        flex items-center  font-bold tracking-[0.15rem]
        ${mode === "full-screen" ? "text-xl" : "text-base"}
      `}
      >
        {workout.totalTime}MN {enumToString(workout.workoutType ?? "")}
      </motion.div>
    </motion.div>
  );
}
