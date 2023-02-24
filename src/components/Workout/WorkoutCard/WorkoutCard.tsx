import { inferRouterOutputs } from "@trpc/server";
import { WorkoutRouterType } from "../../../server/trpc/router/workout-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import WorkoutCardUserAndActions from "./WorkoutCardUserAndActions";
import WorkoutCardTitle from "./WorkoutCardTitle";
import WorkoutCardIllustration from "./WorkoutCardIllustration";
import WorkoutCardBadges from "./WorkoutCardBadges";
import { useLockedBody } from "usehooks-ts";
import { getWorkoutItemsAndRandomIllustrationByDescription } from "../../../utils/workout";
import WorkoutResults from "../../WorkoutResult/WorkoutResults";
import { useFloatingActionButtonStore } from "../../../store/FloatingActionButtonStore";
import WorkoutCardSkeleton from "../WorkoutCardSkeleton";
import { useWorkoutStore } from "../../../store/WorkoutStore";

interface WorkoutCardProps {
  workout:
    | inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number];
  onDuplicate?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onSelect?: () => void;
  onMoveResultUp?: () => void;
  onMoveResultDown?: () => void;
  footer?: React.ReactNode;
  mode?: "card" | "selecteable" | "for-result";
}

export default function WorkoutCard({
  workout,
  onDuplicate,
  onEdit,
  onDelete,
  onSelect,
  onMoveResultUp,
  onMoveResultDown,
  footer,
}: WorkoutCardProps) {
  const [mode, set_mode] = useState<"minified" | "expanded" | "full-screen">(
    "minified"
  );
  const [workoutItems, set_workoutItems] = useState<string[]>();
  const [illustration, set_illustration] = useState<string>();
  const { selectedWorkouts } = useWorkoutStore();

  useEffect(() => {
    const itemsAndIllustration =
      getWorkoutItemsAndRandomIllustrationByDescription(workout.description);
    set_workoutItems(itemsAndIllustration.items);
    set_illustration(itemsAndIllustration.illustration);
  }, []);

  useLockedBody(mode === "full-screen");

  if (!illustration && !workoutItems) {
    return <WorkoutCardSkeleton />;
  }

  return (
    <>
      <AnimatePresence>
        {mode === "full-screen" && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed top-0 left-0 z-20 h-full w-full bg-base-300 bg-opacity-60 backdrop-blur-sm"
          ></motion.div>
        )}
      </AnimatePresence>
      <motion.div
        layout
        layoutId={workout.id.toString()}
        className={` bg-base-300 p-5 pb-4
          ${
            mode === "full-screen"
              ? "fixed top-0 bottom-0 left-0 z-50 w-full overflow-scroll rounded-none"
              : "relative rounded-3xl"
          }
        `}
      >
        <WorkoutCardIllustration illustration={illustration} mode={mode} />
        <motion.div className="relative">
          <WorkoutCardUserAndActions
            onGoback={() => set_mode("minified")}
            onOpenFullScreen={() => set_mode("full-screen")}
            onToggleSelect={onSelect}
            isSelected={selectedWorkouts.some((w) => w.id === workout.id)}
            onEdit={onEdit}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            workout={workout}
            mode={mode}
          />
          <WorkoutCardTitle workout={workout} mode={mode} />

          <motion.div
            onClick={() => mode === "minified" && set_mode("expanded")}
          >
            {mode === "minified" && workoutItems && workoutItems.length > 0 ? (
              <div
                className={`
            mx-auto mt-2 max-w-[220px] text-center text-xs font-light
            uppercase 
          `}
              >
                FEAT. {workoutItems?.join(" - ")}
              </div>
            ) : (
              <div
                onClick={() => mode === "expanded" && set_mode("minified")}
                className={`relative mt-5 whitespace-pre-wrap text-center text-[11.5px] leading-[18px] text-base-content text-opacity-70 
                ${
                  mode === "full-screen"
                    ? "-z-10 mb-12 text-sm font-light leading-[22px] tracking-tight text-opacity-100"
                    : ""
                }
              `}
              >
                <div
                  className={`absolute -left-1 -top-6 text-[76px] opacity-20 ${
                    mode === "full-screen" ? "visible" : "hidden"
                  }`}
                >
                  “
                </div>
                {workout.description}
                <div
                  className={`absolute -right-1 -bottom-12 text-[76px] opacity-20 ${
                    mode === "full-screen" ? "visible" : "hidden"
                  }`}
                >
                  ”
                </div>
              </div>
            )}

            <WorkoutCardBadges workout={workout} />
          </motion.div>

          {mode === "full-screen" && (
            <div>
              <div className="divider mt-12 mb-8 opacity-70"></div>
              {<WorkoutResults workoutId={workout.id} />}
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
