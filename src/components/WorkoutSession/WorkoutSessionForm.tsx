import { useEffect, useMemo, useState } from "react";
import {
  useForm,
  Controller,
  SubmitHandler,
  useFieldArray,
} from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import WorkoutSelectField from "../Workout/WorkoutSelectField";
import { useWorkoutSessionService } from "../../services/useWorkoutSessionService";
import { useToastStore } from "../../store/ToastStore";
import { z } from "zod";
import WorkoutResultForm from "../WorkoutResult/WorkoutResultForm";
import { useWorkoutResultService } from "../../services/useWorkoutResultService";
import { useRouter } from "next/router";
import { Reorder } from "framer-motion";
import WorkoutSessionResultItem from "./WorkoutSessionResultItem";
import { InferMutationInput, InferQueryOutput } from "../../types/trpc";
import {
  CreateWorkoutSessionInputSchema,
  WorkoutResultWithWorkout,
} from "../../types/app";
import { isBefore } from "date-fns";
import { useSidebarStore } from "../../store/SidebarStore";
import Portal from "../Portal/Portal";

interface WorkoutSessionFormProps {
  existingWorkoutSession?:
    | InferQueryOutput<"event.get-events">[number]["workoutSession"]
    | InferQueryOutput<"workout-session.get-workout-session-by-id">;
  onSuccess?: () => void;
}
const WorkoutSessionForm = ({
  existingWorkoutSession,
  onSuccess,
}: // editMode = false,
WorkoutSessionFormProps) => {
  const router = useRouter();
  const { addMessage, closeMessage } = useToastStore();
  const { createOrEditWorkoutSession } = useWorkoutSessionService();
  const { createOrEditMultipleWorkoutResult, deleteMultipleWorkoutResult } =
    useWorkoutResultService();

  const { set_isSidebarLocked } = useSidebarStore();

  const defaultValues = useMemo(() => {
    return {
      id: existingWorkoutSession?.id ?? undefined,
      date: existingWorkoutSession?.event.eventDate ?? new Date(),
      workoutResults: existingWorkoutSession?.workoutResults ?? undefined,
      eventId: existingWorkoutSession?.eventId ?? undefined,
    };
  }, []);

  const [editWorkoutResultIndex, set_editWorkoutResultIndex] =
    useState<number>(-1);

  useEffect(() => {
    if (editWorkoutResultIndex === -1) {
      set_isSidebarLocked(false);
    } else {
      set_isSidebarLocked(true);
    }
  }, [editWorkoutResultIndex]);

  const {
    handleSubmit,
    reset,
    getValues,
    control,
    formState: { isSubmitting, isDirty },
  } = useForm<
    InferMutationInput<"workout-session.addOrEdit"> & {
      workoutResults: WorkoutResultWithWorkout[];
    }
  >({
    defaultValues,
  });

  const handleCreateOrEdit: SubmitHandler<
    z.infer<typeof CreateWorkoutSessionInputSchema>
  > = async (
    workoutSession: z.infer<typeof CreateWorkoutSessionInputSchema>
  ) => {
    let message = addMessage({
      type: "pending",
      message: "Creating workout session",
    });
    const savedWorkoutSession = await createOrEditWorkoutSession.mutateAsync(
      workoutSession
    );
    closeMessage(message);
    if (workoutSession.workoutResults?.length ?? 0 > 0) {
      message = addMessage({
        type: "pending",
        message: "Adding workouts to this session",
      });
      await createOrEditMultipleWorkoutResult.mutateAsync({
        workoutResults: workoutSession.workoutResults,
        workoutSessionId: savedWorkoutSession.id,
      });
      closeMessage(message);
    }

    const resultsToDelete = existingWorkoutSession?.workoutResults
      .filter((existingRes) =>
        workoutSession?.workoutResults.every((res) => res.id !== existingRes.id)
      )
      .map((resToDelete) => resToDelete.id);

    if (resultsToDelete && resultsToDelete.length > 0) {
      await deleteMultipleWorkoutResult.mutateAsync({
        ids: resultsToDelete,
      });
    }

    addMessage({
      type: "success",
      message: `Session ${
        existingWorkoutSession ? "edited" : "created"
      } successfully`,
    });
    onSuccess && onSuccess();
  };

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  const {
    fields: workoutResults,
    replace: replaceWorkoutResults,
    append: appendWorkoutResults,
    update: updateWorkoutResults,
    remove: removeWorkoutResults,
    move: moveWorkoutResults,
  } = useFieldArray({
    keyName: "key",
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "workoutResults", // unique name for your Field Array
  });

  return (
    <>
      <form
        className="mt-5 flex flex-col pb-10"
        onSubmit={handleSubmit(handleCreateOrEdit)}
      >
        <div className="flex flex-col gap-3">
          <div className="form-control relative w-full flex-1">
            <label className="label">
              <span className="label-text">Session date</span>
            </label>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <DatePicker
                  className="input w-full bg-base-200"
                  // disabled={!editMode}
                  showTimeInput
                  placeholderText="Select date"
                  onChange={(date: Date) => field.onChange(date)}
                  selected={field.value}
                  popperPlacement="top"
                  dateFormat="MMMM d, h:mm aa"
                />
              )}
            />
          </div>

          {/* {editMode && ( */}
          <div className="form-control relative">
            <label className="label">
              <span className="label-text">Add workouts to this session </span>
            </label>

            <WorkoutSelectField
              selectedIds={workoutResults.map((result) => result.workout.id)}
              handleAddWorkout={(workout) =>
                appendWorkoutResults({
                  workout: workout,
                  workoutId: workout.id,
                })
              }
            />
          </div>
          {/* )} */}
          {workoutResults.length > 0 && (
            <div className="form-control relative w-full flex-1 mt-2">
              <label className="label">
                <span className="label-text">
                  Session workouts {`(${workoutResults.length})`}
                </span>
              </label>
              <div className="text-sm flex flex-col gap-8">
                <Reorder.Group
                  values={workoutResults}
                  onReorder={(values) => replaceWorkoutResults(values)}
                >
                  {workoutResults.map((result, index) => (
                    <WorkoutSessionResultItem
                      key={result.workout.id}
                      isDone={isBefore(getValues("date"), new Date())}
                      result={result}
                      onRemoveWorkoutResult={() => removeWorkoutResults(index)}
                      onMoveResultUp={() =>
                        index > 0 && moveWorkoutResults(index, index - 1)
                      }
                      onMoveResultDown={() =>
                        index < workoutResults.length - 1 &&
                        moveWorkoutResults(index, index + 1)
                      }
                      onOpenWorkoutResultDetail={() =>
                        set_editWorkoutResultIndex(index)
                      }
                    />
                  ))}
                </Reorder.Group>
              </div>
            </div>
          )}
        </div>
        {isDirty && (
          <div className="flex flex-col text-sm gap-2">
            <button
              className={`btn mt-2 ${isSubmitting ? "loading" : ""}`}
              type="submit"
            >
              {`Save this session`}
            </button>
            Changes needs to be saved or the data will be lost
          </div>
        )}

        {editWorkoutResultIndex !== -1 && (
          <Portal>
            <WorkoutResultForm
              onSave={(workoutResult) => {
                updateWorkoutResults(editWorkoutResultIndex, workoutResult);
                set_editWorkoutResultIndex(-1);
              }}
              onClose={() => set_editWorkoutResultIndex(-1)}
              workoutResult={
                workoutResults[
                  editWorkoutResultIndex
                ] as WorkoutResultWithWorkout
              }
            />
          </Portal>
        )}
      </form>
    </>
  );
};

export default WorkoutSessionForm;