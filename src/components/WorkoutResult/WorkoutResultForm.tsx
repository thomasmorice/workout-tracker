import TextareaAutosize from "react-textarea-autosize";
import { useEffect, useState } from "react";
import { WorkoutResultInputsWithWorkout } from "../../types/app";

export interface WorkoutResultFormProps {
  workoutResult: WorkoutResultInputsWithWorkout;
  onSave: (result: WorkoutResultInputsWithWorkout) => void;
}

export default function WorkoutResultForm({
  workoutResult,
  onSave,
}: WorkoutResultFormProps) {
  const [editedWorkoutResult, set_editedWorkoutResult] =
    useState(workoutResult);

  const [resultTotalTimeMn, set_resultTotalTimeMn] = useState(
    workoutResult.time ? Math.floor(workoutResult.time / 60) + "" : ""
  );
  const [resultTotalTimeSec, set_resultTotalTimeSec] = useState(
    workoutResult.time ? (workoutResult.time % 60) + "" : ""
  );

  useEffect(() => {
    if (parseInt(resultTotalTimeMn)) {
      // if (!parseInt(resultTotalTimeSec)) {
      //   set_resultTotalTimeSec("0");
      // }
      set_editedWorkoutResult({
        ...editedWorkoutResult,
        time:
          parseInt(resultTotalTimeMn) * 60 +
          (parseInt(resultTotalTimeSec) || 0),
      });
    } else {
      set_editedWorkoutResult({
        ...editedWorkoutResult,
        time: null,
      });
    }
  }, [resultTotalTimeMn, resultTotalTimeSec]);

  return (
    <>
      <h3 className="mb-4 text-xl font-bold capitalize">Edit result</h3>

      <div className="flex flex-col gap-2">
        <div className="form-control w-full">
          <div
            style={{
              background: "#2a303c",
              boxShadow:
                "inset 2px 2px 0px #242933, inset -2px -2px 0px #303745",
            }}
            className="max-h-20 overflow-y-scroll whitespace-pre-wrap rounded-xl border-b border-white border-opacity-20 p-2 text-[0.7rem] opacity-80"
          >
            {workoutResult.workout.description}
          </div>
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Overall feeling</span>
          </label>

          <div className="flex items-center">
            <div className="rating gap-3">
              {[...Array(5)].map((x, index) => (
                <input
                  onChange={() =>
                    set_editedWorkoutResult({
                      ...editedWorkoutResult,
                      rating: index + 1,
                    })
                  }
                  checked={index + 1 === editedWorkoutResult.rating}
                  type="radio"
                  name="rating"
                  className={`mask mask-heart bg-base-content ${
                    editedWorkoutResult.rating ? "" : "bg-opacity-10"
                  } `}
                  key={index}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Result</span>
          </label>

          <TextareaAutosize
            value={editedWorkoutResult.description ?? ""}
            onChange={(e) =>
              set_editedWorkoutResult({
                ...editedWorkoutResult,
                description: e.target.value,
              })
            }
            className="textarea-bordered textarea leading-normal placeholder:opacity-50"
            rows={4}
            maxRows={12}
            placeholder="Great workout with a lot of..."
          />
        </div>

        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-4">
            <input
              type="checkbox"
              className="toggle"
              onChange={(e) =>
                set_editedWorkoutResult({
                  ...editedWorkoutResult,
                  shouldRecommendWorkoutAgain: e.target.checked,
                })
              }
              checked={editedWorkoutResult.shouldRecommendWorkoutAgain ?? false}
            />
            <span className="label-text">
              Should we recommend that workout again?
            </span>
          </label>
        </div>

        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-4">
            <input
              type="checkbox"
              className="toggle"
              onChange={(e) =>
                set_editedWorkoutResult({
                  ...editedWorkoutResult,
                  isRx: e.target.checked,
                })
              }
              checked={editedWorkoutResult.isRx ?? false}
            />
            <span className="label-text">Was this workout done Rx?</span>
          </label>
        </div>

        <div className="flex flex-wrap gap-y-4">
          {workoutResult.workout.workoutType === "FOR_TIME" && (
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Total time</span>
              </label>

              <label className="input-group">
                <input
                  id="input-time"
                  className="input max-w-[80px] flex-1 bg-base-200 placeholder:opacity-50"
                  placeholder="12"
                  type={"number"}
                  value={resultTotalTimeMn}
                  onChange={(e) => set_resultTotalTimeMn(e.target.value)}
                />
                <span>mn</span>

                <input
                  id="input-time"
                  className="input ml-2 max-w-[80px] flex-1 bg-base-200 placeholder:opacity-50"
                  placeholder="45"
                  type={"number"}
                  value={resultTotalTimeSec}
                  onChange={(e) => set_resultTotalTimeSec(e.target.value)}
                />
                <span>sec</span>
              </label>
            </div>
          )}

          {(workoutResult.workout.workoutType === "AMRAP" ||
            workoutResult.workout.workoutType === "FOR_TIME") && (
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Repetitions</span>
              </label>

              <label className="input-group">
                <input
                  id="input-repetitions"
                  className="input max-w-[110px] flex-1 bg-base-200 placeholder:opacity-50"
                  placeholder="50"
                  type={"number"}
                  value={editedWorkoutResult.totalReps ?? ""}
                  onChange={(e) =>
                    set_editedWorkoutResult({
                      ...editedWorkoutResult,
                      totalReps: parseInt(e.target.value ?? null),
                    })
                  }
                />
                <span>Reps</span>
              </label>
              {workoutResult.workout.workoutType === "FOR_TIME" && (
                <span className="pt-2 text-xs">{`(if you haven't finished the workout)`}</span>
              )}
            </div>
          )}
        </div>

        {(workoutResult.workout.workoutType === "ONE_REP_MAX" ||
          workoutResult.workout.workoutType === "X_REP_MAX") && (
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Weight</span>
            </label>
            <label className="input-group">
              <input
                id="input-rep-max"
                className="input max-w-[110px] flex-1 bg-base-200 placeholder:opacity-50"
                onChange={(e) =>
                  set_editedWorkoutResult({
                    ...editedWorkoutResult,
                    weight: parseFloat(e.target.value ?? null),
                  })
                }
                placeholder="120"
                type={"number"}
                value={editedWorkoutResult.weight ?? ""}
              />
              <span>Kg</span>
            </label>
          </div>
        )}

        <button
          type="button"
          onClick={() => onSave(editedWorkoutResult)}
          className="btn mt-4"
        >
          Save this result
        </button>
      </div>
    </>
  );
}
