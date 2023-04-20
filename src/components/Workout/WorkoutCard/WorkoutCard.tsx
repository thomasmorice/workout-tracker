import { inferRouterOutputs } from "@trpc/server";
import { WorkoutRouterType } from "../../../server/trpc/router/WorkoutRouter/workout-router";
import { useEffect, useMemo, useState } from "react";
import WorkoutCardUserAndActions from "./WorkoutCardUserAndActions";
import WorkoutCardIllustration from "./WorkoutCardIllustration";
import WorkoutCardBadges from "./WorkoutCardBadges";
import { getWorkoutItemsAndRandomIllustrationByDescription } from "../../../utils/workout";
import WorkoutCardSkeleton from "../WorkoutCardSkeleton";
import { useWorkoutStore } from "../../../store/WorkoutStore";
import { AiFillTag } from "react-icons/ai";
import { GiBiceps } from "react-icons/gi";
import { BsLightningChargeFill } from "react-icons/bs";
import { FaHighlighter, FaRunning } from "react-icons/fa";
import { enumToString } from "../../../utils/formatting";
import Dropdown from "../../Dropdown/Dropdown";
import { RxDotsVertical } from "react-icons/rx";
import { format } from "date-fns";
import Image from "next/image";
import {
  MdCleaningServices,
  MdContentCopy,
  MdDelete,
  MdDone,
  MdEdit,
  MdExpand,
  MdOutlineArrowBackIos,
  MdOutlineLibraryAddCheck,
} from "react-icons/md";

interface WorkoutCardProps {
  workout:
    | inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number]
    | inferRouterOutputs<WorkoutRouterType>["getWorkoutById"];
  onMoveResultUp?: () => void;
  onMoveResultDown?: () => void;
  footer?: React.ReactNode;
  isFullScreen?: boolean;
}

export default function WorkoutCard({
  workout,
  isFullScreen = false,
  onMoveResultUp,
  onMoveResultDown,
}: WorkoutCardProps) {
  const [workoutItems, set_workoutItems] = useState<string[]>();
  const [illustration, set_illustration] = useState<string>();
  const [hasSelection, set_hasSelection] = useState(false);
  const { selectedWorkouts } = useWorkoutStore();
  const {
    toggleSelectWorkout,
    showWorkoutForm,
    createWorkoutFromSelectedText,
    openWorkoutDetail: openWorkoutDetailModal,
    closeWorkoutDetail: closeWorkoutDetailModal,
  } = useWorkoutStore();

  const workoutActions = useMemo(() => {
    const actions = [];
    !isFullScreen &&
      actions.push({
        label: (
          <>
            {" "}
            <MdExpand /> Open card details
          </>
        ),
        onClick: () => openWorkoutDetailModal(workout),
      });

    actions.push({
      label: (
        <>
          {" "}
          <MdOutlineLibraryAddCheck /> Select workout
        </>
      ),
      onClick: () => toggleSelectWorkout(workout),
    });

    actions.push({
      label: (
        <>
          {" "}
          <MdContentCopy /> Duplicate
        </>
      ),
      onClick: () => showWorkoutForm("duplicate", workout),
    });

    if (hasSelection) {
      actions.push({
        label: (
          <>
            <FaHighlighter /> Create workout from selection
          </>
        ),
        onClick: () =>
          createWorkoutFromSelectedText(
            workout,
            window.getSelection()?.toString() || ""
          ),
      });
    }

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

    return actions;
  }, [
    isFullScreen,
    hasSelection,
    openWorkoutDetailModal,
    workout,
    toggleSelectWorkout,
    showWorkoutForm,
    createWorkoutFromSelectedText,
  ]);

  const handleSelection = () => {
    set_hasSelection(false);
    if (window.getSelection()?.toString() !== "") {
      set_hasSelection(true);
    }
  };

  useEffect(() => {
    const itemsAndIllustration =
      getWorkoutItemsAndRandomIllustrationByDescription(workout.description);
    set_workoutItems(itemsAndIllustration.items);
    set_illustration(itemsAndIllustration.illustration);
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelection);
    return () => {
      document.removeEventListener("selectionchange", handleSelection);
    };
  });

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
          <div className="w-full">
            <div
              onClick={closeWorkoutDetailModal}
              className={`btn-ghost btn-circle btn z-10
              ${isFullScreen ? "absolute " : "hidden "}`}
            >
              <MdOutlineArrowBackIos className="" size={22} />
            </div>
            {/* AUTHOR */}
            <div
              className={`flex items-center gap-3
            ${isFullScreen ? "flex-col justify-center" : ""}
          `}
            >
              <div className={`avatar`}>
                <div
                  className={`relative rounded-full border-2 border-base-content border-opacity-50 bg-transparent ${
                    isFullScreen ? "mt-12 h-12 w-12" : "h-8 w-8"
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

              {/* Creator name and date */}
              <div
                className={`flex w-full flex-col self-center
              ${isFullScreen ? "text-center" : "text-left"}
            }`}
              >
                <div className="text-xs font-bold uppercase leading-[15px] tracking-[0.05em]">
                  {workout.creator.name}
                </div>
                <div className="text-[11px] tracking-tight text-base-content text-opacity-50">
                  {format(workout.createdAt, "dd/MM/yyyy")}
                </div>
              </div>

              <div
                className={`
            ${
              isFullScreen
                ? "absolute top-1 right-2"
                : `btn-sm absolute -right-6 -top-2`
            }
            
          `}
              >
                {selectedWorkouts.some((w) => w.id === workout.id) ? (
                  <button
                    className="btn-primary btn-sm btn-circle btn mr-3 mt-2"
                    onClick={() => toggleSelectWorkout(workout)}
                  >
                    <MdDone size={17} />
                  </button>
                ) : (
                  <Dropdown
                    withBackdrop
                    buttons={workoutActions}
                    containerClass="dropdown-left"
                  >
                    <div
                      className={`btn-ghost btn-circle btn
                  ${
                    selectedWorkouts.some((w) => w.id === workout.id)
                      ? "btn-primary"
                      : ""
                  }
                `}
                    >
                      <RxDotsVertical size={isFullScreen ? 28 : 23} />
                    </div>
                  </Dropdown>
                )}
              </div>
            </div>
          </div>
          {/* <WorkoutCardUserAndActions
            onGoBack={closeWorkoutDetailModal}
            onOpenFullScreen={() => openWorkoutDetailModal(workout)}
            onToggleSelect={() => toggleSelectWorkout(workout)}
            isSelected={selectedWorkouts.some((w) => w.id === workout.id)}
            onEdit={() => showWorkoutForm("edit", workout)}
            onDuplicate={() => showWorkoutForm("duplicate", workout)}
            onDelete={() => showWorkoutForm("delete", workout)}
            workout={workout}
            isFullScreen={isFullScreen}
            onClassify={() => onClassify && onClassify()} 
          />*/}

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
            <div
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
