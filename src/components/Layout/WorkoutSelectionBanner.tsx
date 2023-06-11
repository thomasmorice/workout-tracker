import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useState } from "react";
import { MdOutlineExpandMore } from "react-icons/md";
import { useEventStore } from "../../store/EventStore";
import { useWorkoutStore } from "../../store/WorkoutStore";
import { useRouter } from "next/router";
import { useLockedBody } from "usehooks-ts";
import WorkoutSessionForm from "../WorkoutSession/WorkoutSessionForm";

export default function WorkoutSelectionBanner() {
  const workoutCounterAnimation = useAnimationControls();
  const { selectedWorkouts, clearSelectedWorkouts } = useWorkoutStore();
  const [expandedBanner, set_expandedBanner] = useState(false);
  const router = useRouter();

  useLockedBody(expandedBanner);

  useEffect(() => {
    if (selectedWorkouts.length > 0) {
      workoutCounterAnimation.start({
        scale: [1, 1.15, 0.9, 1.15, 1],
        transition: { duration: 0.6 },
      });
    }
  }, [selectedWorkouts, workoutCounterAnimation]);

  return (
    <div
      className={`fixed bottom-0 left-0 z-50 flex w-full px-3 transition-all ${
        expandedBanner
          ? "h-full flex-col overflow-auto bg-base-100 pb-8"
          : "h-16 items-center  bg-base-300"
      }`}
    >
      <div
        className={`flex w-full items-center justify-between ${
          expandedBanner ? "mt-4 h-8" : "h-full"
        }
      `}
      >
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase">
          <div className="placeholder avatar ">
            <motion.div
              animate={workoutCounterAnimation}
              className="w-5 rounded-full bg-base-content text-base-300"
            >
              <span>{selectedWorkouts.length}</span>
            </motion.div>
          </div>
          workout(s) selected
        </div>
        <div className="flex items-center gap-1">
          {!expandedBanner ? (
            <button
              onClick={() => {
                set_expandedBanner(true);
              }}
              className="btn-primary btn-xs btn rounded-full"
            >
              Plan session
            </button>
          ) : (
            <button
              className="btn-ghost btn-sm btn-circle btn"
              onClick={() => set_expandedBanner(false)}
              type="button"
            >
              <MdOutlineExpandMore size={22} />
            </button>
          )}
        </div>
      </div>
      {expandedBanner && (
        <div className="mt-4 flex flex-col gap-3">
          <WorkoutSessionForm onSuccess={clearSelectedWorkouts} />

          <button onClick={clearSelectedWorkouts} className="btn-sm btn w-full">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
