import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import {
  MdDragIndicator,
  MdTimer,
  MdEdit,
  MdDelete,
  MdLink,
  MdOutlineArrowDropDown,
  MdOutlineArrowDropUp,
} from "react-icons/md";
import { useEffect, useMemo, useState } from "react";
import { WorkoutResultWithWorkout } from "../../types/app";
import { format } from "date-fns";
import { moods } from "../MoodSelector/MoodSelector";
import {
  resultHasBenchmarkeableWorkout,
  workoutResultIsFilled,
} from "../../utils/utils";

interface WorkoutSessionResultItemProps {
  result: WorkoutResultWithWorkout;
  isDone: boolean;
  onOpenWorkoutResultDetail: () => void;
  onRemoveWorkoutResult: () => void;
  onMoveResultDown: () => void;
  onMoveResultUp: () => void;
}

export default function WorkoutSessionResultItem({
  result,
  onOpenWorkoutResultDetail,
  isDone,
  onRemoveWorkoutResult,
  onMoveResultDown,
  onMoveResultUp,
}: WorkoutSessionResultItemProps) {
  const y = useMotionValue(0);
  const dragControls = useDragControls();
  const [isDragging, set_isDragging] = useState(false);

  const hasResults = useMemo(() => {
    if (
      isDone &&
      (result.isRx ||
        (result.description && result.description !== "") ||
        result.totalReps ||
        result.weight ||
        result.rating ||
        result.time)
    ) {
      return true;
    }
    return false;
  }, [result, isDone]);

  const MoodIcon = ({
    moodIndex,
    props,
  }: {
    moodIndex: number;
    props: any;
  }) => {
    const Icon = moods.find((mood) => mood.key === moodIndex)?.icon;
    return <>{Icon && <Icon {...props} />}</>;
  };

  return (
    <Reorder.Item
      dragListener={false}
      dragControls={dragControls}
      value={result}
      whileDrag={{
        scale: 1.02,
        position: "relative",
      }}
      onPointerDown={() => set_isDragging(true)}
      onPointerUp={() => set_isDragging(false)}
      className="mb-12"
    >
      <div className="relative flex flex-col gap-7">
        {/* Workout */}
        <div className="card relative  z-20 bg-base-200 transition-all duration-300 hover:shadow-lg">
          <div className="card-body p-4">
            {/* Drag & drop on desktop */}
            <div
              className={`absolute top-4 right-1.5 hidden  cursor-grab p-2 md:flex ${
                isDragging ? "z-50" : ""
              }`}
              onPointerDown={(event) => {
                event.preventDefault();
                dragControls.start(event);
              }}
            >
              <MdDragIndicator className="h-7 w-7" />
            </div>

            {/* Move position on phone */}

            <div className="absolute right-4 md:hidden">
              <div className="btn-group">
                <button
                  disabled={!onMoveResultDown}
                  onClick={onMoveResultDown}
                  type="button"
                  className="btn btn-xs"
                >
                  <MdOutlineArrowDropDown size="24px" />
                </button>
                <button
                  disabled={!onMoveResultUp}
                  onClick={onMoveResultUp}
                  type="button"
                  className="btn btn-xs"
                >
                  <MdOutlineArrowDropUp size="24px" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1 ">
                <a
                  className="flex max-w-[calc(100%_-_5rem)] gap-2 font-bold hover:underline"
                  target="blank"
                  href={`/workout/${result.workoutId}`}
                >
                  {result.workout.name && result.workout.name !== ""
                    ? result.workout.name
                    : `#${result.workout.id}`}
                  {/* <MdLink size={19} /> */}
                </a>
                <div className="flex items-center gap-x-0.5 text-sm opacity-80">
                  {result.workout.totalTime && (
                    <>
                      <MdTimer /> {`${result.workout.totalTime}mn`}
                    </>
                  )}
                </div>
              </div>

              <div
                className={`text-2xs whitespace-pre-wrap font-light opacity-50`}
              >
                {result.workout.description}
              </div>
            </div>

            {/* <div className="divider my-2 opacity-50"></div> */}

            {/* {hasResults && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                {result.isRx && <div className="badge  badge-success">RX</div>}
                {result.rating && (
                  <div>
                    <MoodIcon
                      props={{
                        size: "32px",
                        className: "badge badge-success",
                      }}
                      moodIndex={result.rating}
                    />
                  </div>
                )}
              </div>
              <div className="whitespace-pre-wrap text-xs opacity-80">
                {result.description}
              </div>
              {resultHasBenchmarkeableWorkout(result) && (
                <div className="badge badge-primary">
                  {result.time && format(result.time * 1000, "mm:ss' minutes'")}
                  {result.totalReps && `${result.totalReps} reps`}
                  {result.weight && `${result.weight}KG`}
                </div>
              )}
            </div>
          )} */}

            {/* <div className="card-actions mt-2 justify-end">
            <div className="btn-group ">
              {isDone && (
                <button
                  type="button"
                  onClick={onOpenWorkoutResultDetail}
                  className="btn btn-outline btn-sm gap-x-2 text-xs"
                >
                  <MdEdit size={17} /> {`Enter the result`}
                </button>
              )}

              <button
                type="button"
                onClick={onRemoveWorkoutResult}
                className="btn btn-outline btn-error btn-sm text-xs"
              >
                <MdDelete size={17} />
              </button>
            </div>
          </div> */}
          </div>
        </div>

        <div className="border- absolute top-0 left-1/2 bottom-0 border-[1px] border-dashed border-base-content"></div>
        {hasResults ? (
          <div className="card relative bg-base-200 transition-all duration-300 hover:shadow-lg">
            <div className="card-body">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  {result.isRx && (
                    <div className="badge  badge-success">RX</div>
                  )}
                  {result.rating && (
                    <div>
                      <MoodIcon
                        props={{
                          size: "32px",
                          className: "badge badge-success",
                        }}
                        moodIndex={result.rating}
                      />
                    </div>
                  )}
                </div>
                <div className="whitespace-pre-wrap text-xs opacity-80">
                  {result.description}
                </div>
                {resultHasBenchmarkeableWorkout(result) && (
                  <div className="badge badge-primary">
                    {result.time &&
                      format(result.time * 1000, "mm:ss' minutes'")}
                    {result.totalReps && `${result.totalReps} reps`}
                    {result.weight && `${result.weight}KG`}
                  </div>
                )}
              </div>

              <div className="card-actions justify-end pt-5">
                <div className="btn-group">
                  <button
                    type="button"
                    onClick={onOpenWorkoutResultDetail}
                    className="btn btn-outline btn-sm z-20 gap-x-2 text-xs"
                  >
                    <MdEdit size={17} /> {`Edit result`}
                  </button>
                  <button
                    type="button"
                    onClick={onRemoveWorkoutResult}
                    className="btn btn-outline btn-error btn-sm text-xs"
                  >
                    <MdDelete size={17} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenWorkoutResultDetail}
            className="btn btn-primary btn-sm z-20 gap-x-2 text-xs"
          >
            <MdEdit size={17} /> {`Enter the result`}
          </button>
        )}
      </div>
    </Reorder.Item>
  );
}
