import { inferRouterOutputs } from "@trpc/server";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import {
  MdArrowBackIosNew,
  MdCheck,
  MdClose,
  MdContentCopy,
  MdDelete,
  MdDragHandle,
  MdDragIndicator,
  MdEdit,
  MdEditRoad,
  MdEvent,
  MdExpand,
  MdOutlineLibraryAddCheck,
  MdOutlineLocationOn,
  MdRemove,
} from "react-icons/md";
import { WorkoutRouterType } from "../../../server/trpc/router/WorkoutRouter/workout-router";
import { enumToString } from "../../../utils/formatting";
import Image from "next/image";
import { RiTimerLine } from "react-icons/ri";
import Dropdown from "../../Dropdown/Dropdown";
import { useWorkoutStore } from "../../../store/WorkoutStore";
import { RxDotsVertical } from "react-icons/rx";
import WorkoutCardBadges from "./WorkoutCardBadges";
import { motion } from "framer-motion";
import WorkoutResults from "../../WorkoutResult/WorkoutResults";
import { useLockedBody } from "usehooks-ts";
// import WorkoutCardActions from "./WorkoutCardActions";

type WorkoutCardProps = {
  workout:
    | inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number]
    | inferRouterOutputs<WorkoutRouterType>["getWorkoutById"];
  workoutResult?: React.ReactNode;
  isWorkoutFromSessionForm?: boolean;
  isDraggable?: boolean;
  onRemoveWorkoutFromSession?: () => void;
  onEditWorkoutResult?: () => void;
};

export default function WorkoutCard({
  workout,
  isWorkoutFromSessionForm = false,
  workoutResult,
  isDraggable = false,
  onRemoveWorkoutFromSession,
  onEditWorkoutResult,
}: WorkoutCardProps) {
  const {
    selectedWorkouts,
    toggleSelectWorkout,
    showWorkoutForm,
    createWorkoutFromSelectedText,
    isWorkoutSelected,
  } = useWorkoutStore();

  const [hasSelection, set_hasSelection] = useState(false);
  const [isFullScreen, set_isFullScreen] = useState(false);

  useLockedBody(isFullScreen);

  const handleSelection = () => {
    set_hasSelection(false);
    if (window.getSelection()?.toString() !== "") {
      set_hasSelection(true);
    }
  };

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelection);
    return () => {
      document.removeEventListener("selectionchange", handleSelection);
    };
  });

  const workoutActions = useMemo(() => {
    const actions = [];
    actions.push({
      label: "Workout",
    });
    !isFullScreen &&
      actions.push({
        label: (
          <>
            <MdExpand /> Open card details
          </>
        ),
        onClick: () => set_isFullScreen(true),
      });
    !isWorkoutFromSessionForm &&
      actions.push({
        label: (
          <>
            <MdOutlineLibraryAddCheck /> Select workout
          </>
        ),
        onClick: () => toggleSelectWorkout(workout),
      });

    (!isWorkoutFromSessionForm || isFullScreen) &&
      actions.push({
        label: (
          <>
            <MdContentCopy /> Duplicate
          </>
        ),
        onClick: () => showWorkoutForm("duplicate", workout),
      });

    (!isWorkoutFromSessionForm || isFullScreen) &&
      actions.push({
        label: (
          <>
            <MdEdit /> Edit
          </>
        ),
        onClick: () => showWorkoutForm("edit", workout),
      });

    (!isWorkoutFromSessionForm || isFullScreen) &&
      actions.push({
        label: (
          <>
            <MdDelete /> Delete
          </>
        ),
        onClick: () => showWorkoutForm("delete", workout),
      });

    isWorkoutFromSessionForm &&
      actions.push({
        label: "Session",
      }) &&
      actions.push({
        label: (
          <>
            {" "}
            <MdEditRoad /> Edit result{" "}
          </>
        ),
        onClick: onEditWorkoutResult,
      }) &&
      actions.push({
        label: (
          <>
            <MdRemove /> Remove from session
          </>
        ),
        onClick: () => {
          if (isWorkoutSelected(workout)) {
            toggleSelectWorkout(workout);
          }
          onRemoveWorkoutFromSession && onRemoveWorkoutFromSession();
        },
      });

    return actions;
  }, [isFullScreen, toggleSelectWorkout, workout, showWorkoutForm]);

  return (
    <>
      <motion.div
        layoutId={workout.id.toString()}
        animate={{
          zIndex: isFullScreen ? 160 : "unset",
        }}
        transition={{
          zIndex: { delay: isFullScreen ? 0 : 0.2 },
        }}
        className={`flex  flex-col border border-base-content border-opacity-5  px-4
          ${
            isFullScreen
              ? "fixed inset-0  w-full overflow-scroll bg-base-100"
              : "relative bg-base-200"
          }
          ${
            isWorkoutFromSessionForm && !isFullScreen
              ? "pb-5 pt-6"
              : "pb-12 pt-28"
          }
      `}
        style={{
          // background: "radial-gradient(circle, #282F3E 40%, #181C25 100%)",
          borderRadius: isFullScreen ? "0px" : "16px",
        }}
      >
        <div
          className={`blurred-mask-parent absolute inset-x-0 -mt-2 flex w-full
          ${
            isWorkoutFromSessionForm && !isFullScreen
              ? "top-5 h-16"
              : "top-10 h-32"
          }`}
        >
          {/STRENGTH|WOD|SKILLS|ENDURANCE|MOBILITY|WEIGHTLIFTING|UNCLASSIFIED|CARDIO/i.test(
            workout.elementType
          ) && (
            <Image
              fill
              src={`/icons/${workout.elementType.toLowerCase()}.png?3`}
              className="blurred-mask flex self-center object-contain"
              alt={`${workout.elementType} workout`}
            />
          )}
        </div>

        <div
          className={`absolute inset-x-0  flex w-full items-center justify-between px-5
          ${isWorkoutFromSessionForm && !isFullScreen ? "top-3" : "top-5"}
        `}
        >
          {isFullScreen ? (
            <button
              type="button"
              onClick={() => {
                set_isFullScreen(false);
              }}
              className="btn-ghost btn-md btn-circle btn"
            >
              <MdArrowBackIosNew size="17" />
            </button>
          ) : (
            <>
              {isWorkoutFromSessionForm ? (
                <div className="flex h-8 w-8  flex-col items-center justify-center rounded-full border-2 border-base-content text-[0.65rem] font-black leading-none">
                  {workout.totalTime}
                  <div className="-mt-1 text-[0.55rem]">mn</div>
                </div>
              ) : (
                <div className={`avatar`}>
                  <div
                    className={`relative rounded-full border-2 border-base-content border-opacity-50 bg-transparent ${
                      isFullScreen ? "h-12 w-12" : "h-10 w-10"
                    }`}
                  >
                    <Image
                      fill
                      className="rounded-full object-cover p-0.5"
                      referrerPolicy="no-referrer"
                      src={workout.creator.image ?? "https://i.pravatar.cc/300"}
                      alt="Workout creator"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {isWorkoutSelected(workout) && !isWorkoutFromSessionForm ? (
            <button
              type="button"
              onClick={() => toggleSelectWorkout(workout)}
              className="btn-circle btn bg-base-100 text-primary"
            >
              <MdCheck size={22} />
            </button>
          ) : (
            <>
              {isDraggable ? (
                <MdDragIndicator size={22} />
              ) : (
                <Dropdown
                  withBackdrop
                  buttons={workoutActions}
                  containerClass="dropdown-left "
                >
                  <div className={`btn-ghost btn-md btn-circle btn`}>
                    <RxDotsVertical size={22} />
                  </div>
                </Dropdown>
              )}
            </>
          )}
        </div>

        <div
          className={`relative z-10 
          ${isWorkoutFromSessionForm && !isFullScreen ? "mt-14" : "mt-16"}
          `}
        >
          <div
            className={`text-center font-black capitalize  text-base-content
              ${
                isWorkoutFromSessionForm && !isFullScreen
                  ? "leading-5"
                  : "text-2xl leading-7"
              }
            `}
          >
            {workout.name ? workout.name : enumToString(workout.elementType)}

            {workout.workoutType && (
              <>
                <br />
                <div
                  className={` ${
                    isWorkoutFromSessionForm && !isFullScreen
                      ? "text-sm"
                      : "text-lg"
                  }`}
                >
                  [{enumToString(workout.workoutType)}]
                </div>
              </>
            )}
          </div>

          {(!isWorkoutFromSessionForm || isFullScreen) && (
            <div className="mt-6 mb-4 flex flex-col gap-0.5 text-sm">
              <div className="flex justify-center gap-2">
                <div className="flex items-center gap-1 ">
                  <MdEvent />
                  {format(workout.affiliateDate ?? workout.createdAt, "dd MMM")}
                </div>

                {workout.totalTime && (
                  <>
                    <div className="flex items-center gap-0.5">
                      <RiTimerLine />
                      {workout.totalTime}mn
                    </div>
                  </>
                )}
              </div>

              {workout.affiliateId && (
                <div className="flex items-center justify-center gap-1">
                  <MdOutlineLocationOn /> Crossfit Solid
                </div>
              )}
            </div>
          )}
          {(!isDraggable || !isWorkoutFromSessionForm || isFullScreen) && (
            <div
              className={`mt-2 whitespace-pre-wrap rounded-xl border-base-content border-opacity-20 text-center text-xs  text-base-content transition-all 
              ${isWorkoutFromSessionForm ? "leading-snug" : "leading-relaxed"}`}
            >
              {workout.description}
            </div>
          )}

          {(!isWorkoutFromSessionForm || isFullScreen) && (
            <div className="mt-6">
              <WorkoutCardBadges workout={workout} />
            </div>
          )}

          {workoutResult && !isDraggable && workoutResult}

          {workout.elementType === "UNCLASSIFIED" && hasSelection && (
            <div className="mt-8 flex justify-center gap-3">
              <button
                onClick={() =>
                  createWorkoutFromSelectedText(
                    workout,
                    window.getSelection()?.toString() || ""
                  )
                }
                className="btn-primary btn-xs btn"
              >
                Classify selection
              </button>
            </div>
          )}

          {workout.elementType === "UNCLASSIFIED" && hasSelection && (
            <div className="mt-8 flex justify-center gap-3">
              <button
                onClick={() =>
                  createWorkoutFromSelectedText(
                    workout,
                    window.getSelection()?.toString() || ""
                  )
                }
                className="btn-primary btn-xs btn"
              >
                Classify selection
              </button>
            </div>
          )}
        </div>

        {isFullScreen && <WorkoutResults workoutId={workout.id} />}
      </motion.div>
    </>
  );
}
