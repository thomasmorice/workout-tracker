import { inferRouterOutputs } from "@trpc/server";
import { WorkoutRouterType } from "../../../server/trpc/router/WorkoutRouter/workout-router";
import { useEffect, useState } from "react";
import WorkoutCardUserAndActions from "./WorkoutCardUserAndActions";
import WorkoutCardIllustration from "./WorkoutCardIllustration";
import WorkoutCardBadges from "./WorkoutCardBadges";
import { getWorkoutItemsAndRandomIllustrationByDescription } from "../../../utils/workout";
import WorkoutCardSkeleton from "../WorkoutCardSkeleton";
import { useWorkoutStore } from "../../../store/WorkoutStore";
import { useRouter } from "next/router";
import { AiFillTag } from "react-icons/ai";
import { GiBiceps } from "react-icons/gi";
import { BsLightningChargeFill } from "react-icons/bs";
import { FaRunning } from "react-icons/fa";
import { enumToString } from "../../../utils/formatting";

interface WorkoutCardProps {
  workout:
    | inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number]
    | inferRouterOutputs<WorkoutRouterType>["getWorkoutById"];
  onGoBack?: () => void;
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
  onGoBack,
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
      <div
        className={`relative  p-5 
          ${
            isFullScreen
              ? " z-40 rounded-b-xl bg-base-100 pb-12"
              : "rounded-3xl bg-base-300 pb-4"
          }
        `}
      >
        <WorkoutCardIllustration
          illustration={illustration}
          isFullScreen={isFullScreen}
        />
        <div className="relative px-2">
          <WorkoutCardUserAndActions
            onGoBack={() => onGoBack && onGoBack()}
            onOpenFullScreen={onOpen}
            onToggleSelect={onSelect}
            isSelected={selectedWorkouts.some((w) => w.id === workout.id)}
            onEdit={onEdit}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            workout={workout}
            isFullScreen={isFullScreen}
          />

          <div
            className={`
        flex flex-col items-center font-bold
        ${isFullScreen ? "mt-5" : "mt-3"}
      `}
          >
            <div
              className={`
        flex items-center gap-1.5 text-center  font-semibold tracking-[0.03rem]
        ${isFullScreen ? "text-lg" : "text-base"}
        `}
            >
              {workout.name ? (
                <>
                  <AiFillTag size={14} />
                  <div className="text-base uppercase">{workout.name}</div>
                </>
              ) : (
                <>
                  {workout.elementType.includes("STRENGTH") && (
                    <GiBiceps size={14} />
                  )}
                  {workout.elementType.includes("WOD") && (
                    <BsLightningChargeFill size={14} />
                  )}
                  {workout.elementType.includes("ENDURANCE") && (
                    <FaRunning size={14} />
                  )}
                  {enumToString(workout.elementType)}
                </>
              )}
            </div>
            {workout.workoutType && (
              <div
                className={`
        flex items-center  font-bold tracking-[0.15rem]
        ${isFullScreen ? "text-base" : "text-sm"}
      `}
              >
                [{enumToString(workout.workoutType)}]
              </div>
            )}
          </div>

          <div>
            {/* {!isFullScreen &&
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
            ) : ( */}
            <div
              // onClick={() => isExpanded && set_isExpanded(false)}
              className={`relative mt-3 whitespace-pre-wrap text-center text-[11.5px] leading-[18px] text-base-content text-opacity-70 
                ${
                  isFullScreen
                    ? "-z-10 mt-8 mb-12 text-sm font-light leading-[22px] tracking-tight text-opacity-100"
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
            {/* )} */}

            <WorkoutCardBadges workout={workout} />
          </div>
        </div>
      </div>
    </>
  );
}
