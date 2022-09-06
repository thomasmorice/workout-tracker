import Modal from "../Layout/Navigation/Modal/Modal";
import TextareaAutosize from "react-textarea-autosize";
import { useEffect, useState } from "react";
import MoodSelector from "../MoodSelector/MoodSelector";
import { format } from "date-fns";
import { InferMutationInput, InferQueryOutput } from "../../types/trpc";
import { WorkoutResultWithWorkout } from "../../types/app";

export interface WorkoutResultFormProps {
  workoutResult: WorkoutResultWithWorkout;
  onSave: (result: WorkoutResultWithWorkout) => void;
  onClose: () => void;
}

export default function WorkoutResultForm({
  workoutResult,
  onSave,
  onClose,
}: WorkoutResultFormProps) {
  const [editedWorkoutResult, set_editedWorkoutResult] =
    useState(workoutResult);

  console.log("workoutResult inside", workoutResult);
  return (
    <Modal onClose={onClose}>
      <>
        <h3 className="text-xl font-bold capitalize mb-4">{`Enter a result for workout ${
          workoutResult.workout.name || `#${workoutResult.workout.id}`
        }`}</h3>

        <div className="flex flex-col gap-4">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Overall feeling</span>
            </label>

            <div className="flex items-center">
              <MoodSelector
                onSelect={(mood) =>
                  set_editedWorkoutResult({
                    ...editedWorkoutResult,
                    rating: mood,
                  })
                }
                selectedMood={editedWorkoutResult.rating ?? undefined}
              />
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
              className="textarea placeholder:opacity-50"
              rows={4}
              maxRows={12}
              placeholder="Great workout with a lot of..."
            />
          </div>

          <div className="form-control">
            <label className="label justify-start gap-4 cursor-pointer">
              <input
                type="checkbox"
                className="toggle"
                onChange={(e) =>
                  set_editedWorkoutResult({
                    ...editedWorkoutResult,
                    shouldRecommendWorkoutAgain: e.target.checked,
                  })
                }
                checked={
                  editedWorkoutResult.shouldRecommendWorkoutAgain ?? false
                }
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

          <div className="flex">
            {workoutResult.workout.workoutType === "FOR_TIME" && (
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Total time</span>
                </label>

                <label className="input-group">
                  <input
                    id="input-time"
                    className="input max-w-[110px] flex-1 placeholder:opacity-50"
                    placeholder="122"
                    type={"number"}
                    value={editedWorkoutResult.time ?? ""}
                    onChange={(e) =>
                      set_editedWorkoutResult({
                        ...editedWorkoutResult,
                        time: parseInt(e.target.value ?? null),
                      })
                    }
                  />
                  <span>seconds</span>
                </label>
                {editedWorkoutResult.time && (
                  <span className="text-xs pt-2">
                    {!isNaN(editedWorkoutResult.time) &&
                      ` ${format(
                        editedWorkoutResult.time * 1000,
                        "mm:ss' minutes'"
                      )}`}
                  </span>
                )}
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
                    className="input max-w-[110px] flex-1 placeholder:opacity-50"
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
                  <span className="text-xs pt-2">{`(if you haven't finished the workout)`}</span>
                )}
              </div>
            )}
          </div>

          {workoutResult.workout.workoutType === "ONE_REP_MAX" && (
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Weight</span>
              </label>
              <label className="input-group">
                <input
                  id="input-rep-max"
                  className="input max-w-[110px] flex-1 placeholder:opacity-50"
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
            className="mt-4 btn"
          >{`${editedWorkoutResult.id ? "Edit" : "Save"} result`}</button>
        </div>
      </>
    </Modal>
  );
}
