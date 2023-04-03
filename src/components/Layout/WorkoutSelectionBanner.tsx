import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";
import { MdClose } from "react-icons/md";
import { useEventStore } from "../../store/EventStore";
import { useWorkoutStore } from "../../store/WorkoutStore";
import { useRouter } from "next/router";

export default function WorkoutSelectionBanner() {
  const workoutCounterAnimation = useAnimationControls();
  const { selectedWorkouts, clearSelectedWorkouts, setWorkoutSelectionMode } =
    useWorkoutStore();
  const { addOrEditEvent } = useEventStore();
  const router = useRouter();

  useEffect(() => {
    if (selectedWorkouts.length > 0) {
      workoutCounterAnimation.start({
        scale: [1, 1.15, 0.9, 1.15, 1],
        transition: { duration: 0.6 },
      });
    }
  }, [selectedWorkouts, workoutCounterAnimation]);

  return (
    <div className="fixed bottom-0 left-0 flex h-16 w-full items-center justify-between bg-base-300 px-3">
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
        <button
          onClick={() => {
            // addOrEditEvent({
            //   type: "workout-session",
            // });
            setWorkoutSelectionMode(false);
            router.push("/session/create");
          }}
          className="btn btn-primary btn-xs rounded-full"
        >
          Plan session
        </button>
        <button
          className="btn btn-ghost btn-sm btn-circle"
          onClick={clearSelectedWorkouts}
          type="button"
        >
          <MdClose size={19} />
        </button>
      </div>
    </div>
  );
}