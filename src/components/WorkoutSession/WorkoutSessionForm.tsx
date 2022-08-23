import { useEffect, useMemo, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  WorkoutSession,
  CreateWorkoutSessionInputSchema,
} from "../../server/router/workout-session";
import WorkoutSelectField from "../../components/Workout/WorkoutSelectField";
import { WorkoutWithExtras } from "../../server/router/workout";
import { MdRemove } from "react-icons/md";
import { DifficultyBadge } from "../../components/Workout/WorkoutBadges";
import { useWorkoutSessionService } from "../../services/useWorkoutSessionService";
import { useToastStore } from "../../store/ToastStore";
import { z } from "zod";

interface WorkoutSessionFormProps {
  existingWorkoutSession?: WorkoutSession;
}
const WorkoutSessionForm = ({
  existingWorkoutSession,
}: WorkoutSessionFormProps) => {
  const { addMessage, closeMessage } = useToastStore();
  const { createWorkoutSession } = useWorkoutSessionService();
  const defaultValues = useMemo(() => {
    return {
      id: existingWorkoutSession?.id ?? undefined,
      date: existingWorkoutSession?.date ?? new Date(),
      workoutResults: existingWorkoutSession?.workoutResults ?? undefined,
    };
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    control,
    formState: { isSubmitting },
  } = useForm<z.infer<typeof CreateWorkoutSessionInputSchema>>({
    defaultValues,
  });

  // const [workouts, set_workouts] = useState<WorkoutWithExtras[]>([]);

  const handleCreate: SubmitHandler<
    z.infer<typeof CreateWorkoutSessionInputSchema>
  > = async (
    workoutSession: z.infer<typeof CreateWorkoutSessionInputSchema>
  ) => {
    let message = addMessage({
      type: "pending",
      message: "Creating workout session",
    });
    await createWorkoutSession.mutateAsync(workoutSession);
    closeMessage(message);
    if (workoutSession.workoutResults?.length ?? 0 > 0) {
      message = addMessage({
        type: "pending",
        message: "Adding workouts to this session",
      });

      // await createWorkoutResult.mutateAsync(workoutSession);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold capitalize">Add a new session</h1>
      <form
        className="mt-5 flex flex-col pb-10"
        onSubmit={handleSubmit(handleCreate)}
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
              <span className="label-text">Add workouts to this session</span>
            </label>
            <WorkoutSelectField
              selectedIds={
                getValues("workoutResults")?.map(
                  (result) => result.workout.id
                ) ?? []
              }
              handleAddWorkout={(workout) =>
                setValue("workoutResults", [
                  ...(getValues("workoutResults") ?? []),
                  {
                    workout: workout,
                  },
                ])
              }
              // selectedIds={workouts.map((workout) => workout.id)}
              // handleAddWorkout={(workout) => {
              //   set_workouts([...workouts, workout]);
              // }}
            />

            {(getValues("workoutResults")?.length ?? 0) > 0 && (
              <>
                <div className="form-control relative w-full flex-1 mt-2">
                  <label className="label">
                    <span className="label-text">
                      Selected workouts{" "}
                      {`(${getValues("workoutResults").length})`}
                    </span>
                  </label>
                  <div className="text-sm flex flex-col gap-2">
                    {workouts.map((workout) => (
                      <div
                        key={workout.id}
                        className="flex flex-col p-3 bg-base-200 gap-1 rounded-lg"
                      >
                        <div className=" flex items-center gap-3 ">
                          <div className="flex items-center ">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                set_workouts(
                                  workouts.filter((w) => w.id !== workout.id)
                                );
                              }}
                              className="btn btn-sm btn-circle btn-ghost"
                            >
                              <MdRemove size={27} className="text-error p-1" />
                            </button>
                          </div>
                          <DifficultyBadge difficulty={workout.difficulty} />
                          {workout.name ? workout.name : `#${workout.id}`}
                        </div>
                        <div className="overflow-hidden ml-2 text-ellipsis whitespace-pre-wrap cursor-default text-2xs">
                          {workout.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="mt-3 flex justify-end gap-4 flex-wrap">
          <button
            className={`btn mt-2 ${isSubmitting ? "loading" : ""}`}
            type="submit"
          >
            {`Save this session`}
          </button>
        </div>
      </form>
    </>
  );
};

export default WorkoutSessionForm;
