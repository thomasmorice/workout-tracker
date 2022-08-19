import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { NextPage } from "next";
import Head from "next/head";
import { WorkoutSession } from "../../server/router/workout-session";
import WorkoutSelectField from "../../components/Workout/WorkoutSelectField";
import { WorkoutWithExtras } from "../../server/router/workout";

const WorkoutSessionForm: NextPage = () => {
  // const { state, session: existingSession } = useWorkoutSessionFormStore();

  const defaultValues = useMemo(() => {
    return {
      // id: existingSession?.id ?? undefined,
      // date: existingSession?.date ?? new Date(),
      // workoutResults: existingSession?.workoutResults ?? [],
      id: undefined,
      date: new Date(),
      createdAt: undefined,
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
  } = useForm<WorkoutSession>({
    defaultValues,
  });

  const [workouts, set_workouts] = useState<WorkoutWithExtras[]>([]);

  return (
    <>
      <Head>
        <title>Workout session</title>
        <meta name="description" content="Add or edit a session" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-3xl font-bold capitalize">Add a new session</h1>
      <form
        className="mt-5 flex flex-col"
        onSubmit={async (e) => {
          try {
            const action = (
              e.nativeEvent as SubmitEvent
            ).submitter?.getAttribute("data-action");
            if (action === "save") {
              // await handleSubmit(handleSave)(e);
            } else if (action == "duplicate-and-delete") {
              // await handleSubmit(handleDuplicateAndDelete)(e);
            }
            // closeWorkoutForm();
          } catch (e) {
            console.error(e);
          }
        }}
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
              handleAddWorkout={(workout) => {
                set_workouts([...workouts, workout]);
              }}
            />

            {workouts.length > 0 && (
              <>
                <div className="text-lg">Workouts for this session</div>
                {workouts.map((workout) => (
                  <div key={workout.id}>
                    <div>{workout.id}</div>
                  </div>
                ))}
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
