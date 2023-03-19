import { inferRouterOutputs } from "@trpc/server";
import { WorkoutRouterType } from "../../../server/trpc/router/workout-router";
import { useEffect, useState } from "react";
import WorkoutCardUserAndActions from "./WorkoutCardUserAndActions";
import WorkoutCardTitle from "./WorkoutCardTitle";
import WorkoutCardIllustration from "./WorkoutCardIllustration";
import WorkoutCardBadges from "./WorkoutCardBadges";
import { useLockedBody } from "usehooks-ts";
import { getWorkoutItemsAndRandomIllustrationByDescription } from "../../../utils/workout";
import WorkoutResults from "../../WorkoutResult/WorkoutResults";
import WorkoutCardSkeleton from "../WorkoutCardSkeleton";
import { useWorkoutStore } from "../../../store/WorkoutStore";
import { useRouter } from "next/router";
import Header from "../../Layout/Header";

interface WorkoutCardProps {
  workout:
    | inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number];
  onDuplicate?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onSelect?: () => void;
  onOpen?: () => void;
  onMoveResultUp?: () => void;
  onMoveResultDown?: () => void;
  footer?: React.ReactNode;
  isFullScreen?: boolean;
}

export default function WorkoutCard({
  workout,
  onDuplicate,
  onEdit,
  onDelete,
  onSelect,
  isFullScreen = false,
  onOpen,
  onMoveResultUp,
  onMoveResultDown,
  footer,
}: WorkoutCardProps) {
  const [isExpanded, set_isExpanded] = useState(false);
  const [workoutItems, set_workoutItems] = useState<string[]>();
  const [illustration, set_illustration] = useState<string>();
  const { selectedWorkouts } = useWorkoutStore();
  const router = useRouter();

  useEffect(() => {
    const itemsAndIllustration =
      getWorkoutItemsAndRandomIllustrationByDescription(workout.description);
    set_workoutItems(itemsAndIllustration.items);
    set_illustration(itemsAndIllustration.illustration);
  }, []);

  if (!illustration && !workoutItems) {
    return <WorkoutCardSkeleton />;
  }

  return (
    <>
      {/* {isFullScreen && (
        <Header onGoBack={() => router.back()} h1={"Workout details"} />
      )} */}
      <div
        className={`relative bg-base-300 p-5 
          ${
            isFullScreen
              ? " z-40 rounded-b-xl pb-12 shadow-lg"
              : "rounded-3xl pb-4"
          }
        `}
      >
        <WorkoutCardIllustration
          illustration={illustration}
          isFullScreen={isFullScreen}
        />
        <div className="relative">
          <WorkoutCardUserAndActions
            onGoback={() => router.back()}
            onOpenFullScreen={() => {
              router.push(`/workout/${workout.id}`, undefined, {
                shallow: true,
              });
            }}
            onToggleSelect={onSelect}
            isSelected={selectedWorkouts.some((w) => w.id === workout.id)}
            onEdit={onEdit}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            workout={workout}
            isFullScreen={isFullScreen}
          />
          <WorkoutCardTitle workout={workout} isFullScreen={isFullScreen} />

          <div onClick={() => !isExpanded && set_isExpanded(true)}>
            {!isExpanded &&
            !isFullScreen &&
            workoutItems &&
            workoutItems.length > 0 ? (
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
                onClick={() => isExpanded && set_isExpanded(false)}
                className={`relative mt-12 whitespace-pre-wrap text-center text-[11.5px] leading-[18px] text-base-content text-opacity-70 
                ${
                  isFullScreen
                    ? "-z-10 mb-12 text-sm font-light leading-[22px] tracking-tight text-opacity-100"
                    : ""
                }
              `}
              >
                <div
                  className={`absolute -left-1 -top-6  text-[76px] opacity-20 ${
                    isFullScreen ? "visible" : "hidden"
                  }`}
                >
                  “
                </div>
                {workout.description}
                <div
                  className={`absolute -right-1 -bottom-12 text-[76px] opacity-20 ${
                    isFullScreen ? "visible" : "hidden"
                  }`}
                >
                  ”
                </div>
              </div>
            )}

            <WorkoutCardBadges workout={workout} />
          </div>

          {/* {isFullScreen && (
            <div>
              <div className="divider mt-12 mb-8 opacity-70"></div>
              {<WorkoutResults workoutId={workout.id} />}
            </div>
          )} */}
        </div>
      </div>
    </>
  );
}
