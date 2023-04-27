import { inferRouterOutputs } from "@trpc/server";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import {
  MdArrowBackIosNew,
  MdCheck,
  MdClose,
  MdContentCopy,
  MdDelete,
  MdEdit,
  MdEvent,
  MdExpand,
  MdOutlineLibraryAddCheck,
  MdOutlineLocationOn,
} from "react-icons/md";
import { WorkoutRouterType } from "../../../server/trpc/router/WorkoutRouter/workout-router";
import { enumToString } from "../../../utils/formatting";
import Image from "next/image";
import { RiTimerLine } from "react-icons/ri";
import Dropdown from "../../Dropdown/Dropdown";
import { useWorkoutStore } from "../../../store/WorkoutStore";
import { RxDotsVertical } from "react-icons/rx";
import WorkoutCardBadges from "../WorkoutCard/WorkoutCardBadges";
import { motion } from "framer-motion";
import WorkoutResults from "../../WorkoutResult/WorkoutResults";
import { useLockedBody } from "usehooks-ts";

type WorkoutCardProps = {
  workout:
    | inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number]
    | inferRouterOutputs<WorkoutRouterType>["getWorkoutById"];
};

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  const {
    selectedWorkouts,
    toggleSelectWorkout,
    showWorkoutForm,
    createWorkoutFromSelectedText,
    openWorkoutDetail: openWorkoutDetailModal,
    closeWorkoutDetail: closeWorkoutDetailModal,
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
    !isFullScreen &&
      actions.push({
        label: (
          <>
            <MdExpand /> Open card details
          </>
        ),
        onClick: () => set_isFullScreen(true),
      });

    actions.push({
      label: (
        <>
          <MdOutlineLibraryAddCheck /> Select workout
        </>
      ),
      onClick: () => toggleSelectWorkout(workout),
    });

    actions.push({
      label: (
        <>
          <MdContentCopy /> Duplicate
        </>
      ),
      onClick: () => showWorkoutForm("duplicate", workout),
    });

    actions.push({
      label: (
        <>
          <MdEdit /> Edit
        </>
      ),
      onClick: () => showWorkoutForm("edit", workout),
    });

    actions.push({
      label: (
        <>
          <MdDelete /> Delete
        </>
      ),
      onClick: () => showWorkoutForm("delete", workout),
    });
    isFullScreen &&
      actions.push({
        label: (
          <>
            <MdClose /> Close
          </>
        ),
        onClick: () => set_isFullScreen(false),
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
        className={` flex flex-col px-4 py-12 pt-28
          ${isFullScreen ? "fixed inset-0  w-full overflow-scroll" : "relative"}
      `}
        style={{
          background:
            "radial-gradient(circle, rgba(42,47,60,1) 15%, rgba(24,28,37,1) 100%)",
          borderRadius: isFullScreen ? "0px" : "24px",
        }}
      >
        <div
          className={`blurred-mask-parent absolute inset-x-0 top-10 -mt-2 flex w-full justify-center`}
        >
          {/STRENGTH|WOD|SKILLS|ENDURANCE|MOBILITY|WEIGHTLIFTING|UNCLASSIFIED|CARDIO/i.test(
            workout.elementType
          ) && (
            <motion.img
              layout="preserve-aspect"
              width={128}
              height={128}
              src={`/icons/${workout.elementType.toLowerCase()}.png?3`}
              className="blurred-mask"
              alt={`${workout.elementType} workout`}
            />
          )}
        </div>

        <div className="absolute inset-x-0 top-5 flex w-full items-center justify-between px-5">
          {isFullScreen ? (
            <button
              type="button"
              onClick={() => set_isFullScreen(false)}
              className="btn-circle btn bg-base-100"
            >
              <MdArrowBackIosNew size="15" />
            </button>
          ) : (
            <div onClick={() => set_isFullScreen(false)} className={`avatar`}>
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

          {selectedWorkouts.some((w) => w.id === workout.id) ? (
            <button
              type="button"
              onClick={() => toggleSelectWorkout(workout)}
              className="btn-circle btn bg-base-100 text-primary"
            >
              <MdCheck size={22} />
            </button>
          ) : (
            <Dropdown
              withBackdrop
              buttons={workoutActions}
              containerClass="dropdown-left "
            >
              <div className={`btn-circle btn bg-base-100`}>
                <RxDotsVertical size={17} />
              </div>
            </Dropdown>
          )}
        </div>

        <div
          className={`relative z-10 
          ${isFullScreen ? "mt-16" : "mt-14"}`}
        >
          <div className=" text-center text-2xl font-black capitalize leading-7 text-base-content">
            {workout.name ? workout.name : enumToString(workout.elementType)}

            {workout.workoutType && (
              <>
                <br />
                <div className="text-lg">
                  [{enumToString(workout.workoutType)}]
                </div>
              </>
            )}
          </div>

          <div className="mt-3 flex flex-col gap-0.5 text-sm">
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

          <div
            className={`my-6 whitespace-pre-wrap rounded-xl border-base-content border-opacity-20 text-center text-xs leading-relaxed text-base-content transition-all `}
          >
            {workout.description}
          </div>

          <WorkoutCardBadges workout={workout} />

          {workout.elementType === "UNCLASSIFIED" && hasSelection && (
            <div className="mt-8 flex justify-center gap-3">
              {workout.elementType === "UNCLASSIFIED" && hasSelection && (
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
              )}
            </div>
          )}
        </div>
        {isFullScreen && (
          <div className="mt-8 px-4">
            {<WorkoutResults workoutId={workout.id} />}
          </div>
        )}
      </motion.div>
    </>
  );
}
