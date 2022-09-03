import { useEffect, useMemo, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  WorkoutSession,
  CreateWorkoutSessionInputSchema,
} from "../../../server/router/workout-session";
import WorkoutSelectField from "../../Workout/WorkoutSelectField";
import { useWorkoutSessionService } from "../../../services/useWorkoutSessionService";
import { useToastStore } from "../../../store/ToastStore";
import { z } from "zod";
import WorkoutResultForm from "../../WorkoutResult/WorkoutResultForm";
import { useWorkoutResultService } from "../../../services/useWorkoutResultService";
import { useRouter } from "next/router";
import { Reorder, useDragControls } from "framer-motion";
import WorkoutSessionResultDraggable from "./WorkoutSessionResultDraggable";
import { CreateWorkoutSessionResultInput } from "../../../server/router/workout-result";

interface WorkoutSessionFormProps {
  existingWorkoutSession?: WorkoutSession;
}
const WorkoutSessionForm = ({
  existingWorkoutSession,
}: WorkoutSessionFormProps) => {
  const controls = useDragControls();

  const router = useRouter();
  const { addMessage, closeMessage } = useToastStore();
  const { createOrEditWorkoutSession } = useWorkoutSessionService();
  const { createOrEditMultipleWorkoutResult } = useWorkoutResultService();
  const defaultValues = useMemo(() => {
    return {
      id: existingWorkoutSession?.id ?? undefined,
      date: existingWorkoutSession?.date ?? new Date(),
      workoutResults: existingWorkoutSession?.workoutResults ?? undefined,
    };
  }, []);
  const [hasUnsavedResults, set_hasUnsavedResults] = useState(false);

  const [editWorkoutResult, set_editWorkoutResult] =
    useState<CreateWorkoutSessionResultInput>();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    control,
    formState: { isSubmitting },
  } = useForm<z.infer<typeof CreateWorkoutSessionInputSchema>>({
    defaultValues,
  });

  const watchWorkoutResults = watch("workoutResults");

  const handleCreateOrEdit: SubmitHandler<
    z.infer<typeof CreateWorkoutSessionInputSchema>
  > = async (
    workoutSession: z.infer<typeof CreateWorkoutSessionInputSchema>
  ) => {
    console.log("workoutSession", workoutSession);
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
    addMessage({
      type: "success",
      message: "Session created successfully",
    });
    router.push("/schedule");
  };

  const handleMoveResult = (from: number, to: number) => {
    const arr = [...getValues("workoutResults")];
    const element = arr.splice(from, 1)[0];
    element && arr.splice(to, 0, element);
    setValue("workoutResults", arr);
  };

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  return (
    <>
      <h1 className="text-3xl font-bold capitalize">Add a new session</h1>
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
                  className="input w-full  bg-base-200"
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

          <div className="form-control relative">
            <label className="label">
              <span className="label-text">Add workouts to this session </span>
            </label>

            <WorkoutSelectField
              selectedIds={getValues("workoutResults")?.map(
                (result) => result?.workout.id ?? null
              )}
              handleAddWorkout={(workout) =>
                setValue("workoutResults", [
                  ...(getValues("workoutResults") ?? []),
                  {
                    workout: workout,
                    workoutId: workout.id,
                  },
                ])
              }
            />

            {watchWorkoutResults &&
              (getValues("workoutResults")?.length ?? 0) > 0 && (
                <>
                  <div className="form-control relative w-full flex-1 mt-2">
                    <label className="label">
                      <span className="label-text">
                        Selected workouts{" "}
                        {`(${getValues("workoutResults").length})`}
                      </span>
                    </label>
                    <div className="text-sm flex flex-col gap-8">
                      <Reorder.Group
                        values={getValues("workoutResults")}
                        onReorder={(values) =>
                          setValue("workoutResults", [...values])
                        }
                      >
                        {getValues("workoutResults")
                          ?.sort((a, b) => b.order ?? 1 - (a.order ?? 0))
                          .map((result, index) => (
                            <WorkoutSessionResultDraggable
                              key={result.workout.id}
                              result={result}
                              onRemoveWorkoutResult={() =>
                                setValue(
                                  "workoutResults",
                                  getValues("workoutResults").filter(
                                    (w) => w.workout.id !== result.workout.id
                                  )
                                )
                              }
                              {...(index > 0
                                ? {
                                    onMoveResultUp: () =>
                                      handleMoveResult(index, index - 1),
                                  }
                                : {})}
                              {...(index <
                              getValues("workoutResults").length - 1
                                ? {
                                    onMoveResultDown: () =>
                                      handleMoveResult(index, index + 1),
                                  }
                                : {})}
                              onOpenWorkoutResultDetail={(result) =>
                                set_editWorkoutResult(result)
                              }
                            />
                          ))}
                      </Reorder.Group>
                    </div>
                  </div>
                </>
              )}
          </div>
        </div>
        <div className="mt-3 flex flex-col items-end justify-end gap-4">
          <button
            className={`btn mt-2 ${isSubmitting ? "loading" : ""}`}
            type="submit"
          >
            {`Save this session`}
          </button>
          {hasUnsavedResults && (
            <p className="text-right max-w-xs text-xs bg-error p-1 text-error-content">
              You have unsaved workout results, don&apos;t forget to save the
              session
            </p>
          )}
        </div>

        {editWorkoutResult && (
          <WorkoutResultForm
            onSave={(workoutResult) => {
              console.log("workoutResult", workoutResult);
              const newResults = getValues("workoutResults").map((result) =>
                result.workout.id === workoutResult.workout.id
                  ? workoutResult
                  : result
              );
              setValue("workoutResults", [...newResults]);
              set_editWorkoutResult(undefined);
              set_hasUnsavedResults(true);
            }}
            onClose={() => set_editWorkoutResult(undefined)}
            workoutResult={editWorkoutResult}
          />
        )}
      </form>
    </>
  );
};

export default WorkoutSessionForm;
