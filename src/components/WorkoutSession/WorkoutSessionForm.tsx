import { useEffect, useMemo, useRef, useState } from "react";
import {
  useForm,
  Controller,
  SubmitHandler,
  useFieldArray,
} from "react-hook-form";
import DatePicker from "react-datepicker";
import WorkoutSelectField from "../Workout/WorkoutSelectField";
import { useWorkoutSessionService } from "../../services/useWorkoutSessionService";
import { useToastStore } from "../../store/ToastStore";
import { z } from "zod";
import WorkoutResultForm from "../WorkoutResult/WorkoutResultForm";
import { useWorkoutResultService } from "../../services/useWorkoutResultService";
import { Reorder } from "framer-motion";
import WorkoutSessionResultItem from "./WorkoutSessionResultItem";
import {
  CreateWorkoutSessionInputSchema,
  WorkoutResultInputsWithWorkout,
} from "../../types/app";
import { isBefore } from "date-fns";
import Portal from "../Portal/Portal";
import { useEventStore } from "../../store/EventStore";
import { workoutResultIsFilled } from "../../utils/utils";
import { inferRouterInputs } from "@trpc/server";
import { WorkoutSessionRouterType } from "../../server/trpc/router/workout-session-router";
import { useFloatingActionButtonStore } from "../../store/FloatingActionButtonStore";

interface WorkoutSessionFormProps {
  onSuccess?: () => void;
}
const WorkoutSessionForm = ({ onSuccess }: WorkoutSessionFormProps) => {
  const { addMessage, closeMessage } = useToastStore();
  const { createOrEditWorkoutSession, getWorkoutSessionById } =
    useWorkoutSessionService();
  const { createOrEditMultipleWorkoutResult, deleteMultipleWorkoutResult } =
    useWorkoutResultService();

  const { eventBeingEdited, eventDate, addOrEditEvent } = useEventStore();

  const { data: existingWorkoutSession } = getWorkoutSessionById(
    eventBeingEdited || -1
  );

  const [defaultValues, set_defaultValues] = useState({});
  const { selectedWorkouts: preselectedWorkouts, cleanSelectedWorkouts } =
    useFloatingActionButtonStore();

  useEffect(() => {
    set_defaultValues({
      id: existingWorkoutSession?.id ?? undefined,
      date: existingWorkoutSession?.event.eventDate ?? eventDate ?? new Date(),
      workoutResults:
        existingWorkoutSession?.workoutResults ??
        preselectedWorkouts.map((workout) => ({
          workout,
          workoutId: workout.id,
        })),
      eventId: existingWorkoutSession?.eventId ?? undefined,
    });
  }, [existingWorkoutSession, eventDate]);

  const [editWorkoutResultIndex, set_editWorkoutResultIndex] =
    useState<number>(-1);

  const {
    handleSubmit,
    reset,
    getValues,
    watch,
    control,
    formState: { isSubmitting, isDirty },
  } = useForm<
    inferRouterInputs<WorkoutSessionRouterType>["addOrEdit"] & {
      workoutResults: WorkoutResultInputsWithWorkout[];
    }
  >({
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  watch("date");

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
      cleanSelectedWorkouts();
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

    if (
      workoutSession.workoutResults.every((result) =>
        workoutResultIsFilled(result)
      )
    ) {
      onSuccess
        ? onSuccess()
        : addOrEditEvent({
            type: "workout-session",
            eventId: savedWorkoutSession.id,
          });
    } else {
      addOrEditEvent({
        type: "workout-session",
        eventId: savedWorkoutSession.id,
      });
    }
  };

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
        className="flex flex-col pt-2 md:pt-5"
        onSubmit={handleSubmit(handleCreateOrEdit)}
      >
        <div className="flex flex-col gap-1">
          <div className="form-control relative z-40 w-full flex-1">
            <label className="label">
              <span className="label-text">Session date</span>
            </label>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <DatePicker
                  className="input w-full bg-base-200"
                  onFocus={(e) => (e.target.readOnly = true)}
                  showTimeInput
                  // showTimeSelect
                  placeholderText="Select date"
                  onChange={(date: Date) => field.onChange(date)}
                  selected={field.value}
                  popperPlacement="bottom"
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
            <div className="form-control relative mt-2 w-full flex-1">
              <label className="label">
                <h2 className="h2 mt-3">
                  Session workouts {`(${workoutResults.length})`}
                </h2>
              </label>
              <div className="mt-2 flex flex-col gap-8 text-sm">
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

        <div className="flex flex-col gap-2 text-sm">
          <button
            className={`btn mt-3 ${isSubmitting ? "loading" : ""}`}
            type="button"
            onClick={async () => {
              await handleSubmit(handleCreateOrEdit)();
              onSuccess && onSuccess();
            }}
          >
            {isBefore(getValues("date"), new Date()) ? "Save" : "Plan"}
            {` this session`}
          </button>
        </div>

        {editWorkoutResultIndex !== -1 && (
          <Portal>
            <WorkoutResultForm
              onSave={(workoutResult) => {
                updateWorkoutResults(editWorkoutResultIndex, workoutResult);
                handleSubmit(handleCreateOrEdit)();
                set_editWorkoutResultIndex(-1);
              }}
              onClose={() => set_editWorkoutResultIndex(-1)}
              workoutResult={
                workoutResults[
                  editWorkoutResultIndex
                ] as WorkoutResultInputsWithWorkout
              }
            />
          </Portal>
        )}
      </form>
    </>
  );
};

export default WorkoutSessionForm;
