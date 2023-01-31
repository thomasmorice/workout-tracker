import { inferRouterOutputs } from "@trpc/server";
import { motion } from "framer-motion";
import { BsLightningChargeFill } from "react-icons/bs";
import { GiBiceps } from "react-icons/gi";
import { FaRunning } from "react-icons/fa";
import { WorkoutRouterType } from "../../../server/trpc/router/workout-router";
import { enumToString } from "../../../utils/formatting";

type WorkoutCardTitleProps = {
  isExpanded: boolean;
  workout:
    | inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number]
    | inferRouterOutputs<WorkoutRouterType>["getWorkoutById"];
};

export default function WorkoutCardTitle({
  workout,
  isExpanded,
}: WorkoutCardTitleProps) {
  return (
    <motion.div
      transition={{
        delay: isExpanded ? 0 : 0.3,
      }}
      initial={{
        marginTop: -32,
      }}
      animate={{
        marginTop: isExpanded ? 16 : -32,
      }}
      className={`flex flex-col items-center font-bold`}
    >
      <motion.div className=" flex items-center gap-1.5 text-center text-xs font-semibold tracking-[0.03rem]">
        {workout.elementType.includes("STRENGTH") && <GiBiceps size={14} />}
        {workout.elementType.includes("WOD") && (
          <BsLightningChargeFill size={14} />
        )}
        {workout.elementType.includes("ENDURANCE") && <FaRunning size={14} />}
        {enumToString(workout.elementType)}
      </motion.div>
      <motion.div className="flex items-center text-base tracking-[0.15rem]">
        16MN AMRAP
      </motion.div>
    </motion.div>
  );
}
