import { inferRouterOutputs } from "@trpc/server";
import { AnimatePresence, motion } from "framer-motion";
import { WorkoutRouterType } from "../../../server/trpc/router/workout-router";
import Image from "next/image";
import { format } from "date-fns";

type WorkoutCardUserAndActionsProps = {
  mode: "minified" | "expanded" | "full-screen";
  workout:
    | inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number]
    | inferRouterOutputs<WorkoutRouterType>["getWorkoutById"];
};

export default function WorkoutCardUserAndActions({
  mode,
  workout,
}: WorkoutCardUserAndActionsProps) {
  return (
    <motion.div className="relative z-10 w-full">
      {/* AUTHOR */}
      <motion.div
        className={`flex items-center gap-3
            ${mode === "full-screen" ? "flex-col justify-center" : ""}
          `}
      >
        <motion.div layout className={`avatar`}>
          <motion.div
            className={`relative rounded-full border-2 border-base-content border-opacity-50 bg-transparent transition ${
              mode === "full-screen" ? "w-10" : "w-8"
            }`}
          >
            <Image
              fill
              className="rounded-full object-contain p-0.5 "
              referrerPolicy="no-referrer"
              src={workout.creator.image ?? "https://i.pravatar.cc/300"}
              alt="Workout creator"
            />
          </motion.div>
        </motion.div>

        {/* Creator name and date */}
        <motion.div
          layout="position"
          className={`flex w-full flex-col self-center
              ${mode !== "full-screen" ? "text-left" : "text-center"}
            }`}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: mode === "minified" ? 0 : 1,
            x: mode === "minified" ? -7 : 0,
            lineHeight: mode === "minified" ? "6px" : "14px",
          }}
          transition={{
            delay: mode !== "expanded" ? 0.07 : 0.12,
          }}
        >
          <motion.div className="text-xs font-bold uppercase leading-[15px] tracking-[0.05em]">
            {workout.creator.name}
          </motion.div>
          <motion.div className="text-[11px] tracking-tight text-base-content text-opacity-50">
            {format(workout.createdAt, "dd/MM/yyyy")}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
