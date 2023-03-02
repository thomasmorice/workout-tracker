import { format, parseISO } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { MdArrowBackIosNew, MdEdit, MdModelTraining } from "react-icons/md";
import { getRandomPreparingSessionllustration } from "../../utils/workout";
import { useWorkoutSessionService } from "../../services/useWorkoutSessionService";
import { Controller, useForm } from "react-hook-form";
import { inferRouterInputs } from "@trpc/server";
import { WorkoutSessionRouterType } from "../../server/trpc/router/workout-session-router";
import { WorkoutResultInputsWithWorkout } from "../../types/app";
import { useRouter } from "next/router";
import { useWorkoutStore } from "../../store/WorkoutStore";
import { useEventStore } from "../../store/EventStore";
import { BsLightningChargeFill } from "react-icons/bs";
import { GiBiceps } from "react-icons/gi";
import { enumToString } from "../../utils/formatting";
import { FaRunning } from "react-icons/fa";

type WorkoutSessionFormProps = {
  onSuccess?: () => void;
};

export default function WorkoutSessionForm({
  onSuccess,
}: WorkoutSessionFormProps) {
  const [illustration] = useState(getRandomPreparingSessionllustration());
  const datetimePickerRef = useRef<HTMLInputElement>(null);
  const [showDateTimePicker, set_showDateTimePicker] = useState(false);
  const [defaultValues, set_defaultValues] = useState<{}>({
    date: new Date(),
  });
  const { getWorkoutSessionById } = useWorkoutSessionService();
  const router = useRouter();

  const { selectedWorkouts: preselectedWorkouts, setWorkoutSelectionMode } =
    useWorkoutStore();
  const { eventBeingEdited, eventDate, closeForm } = useEventStore();

  const { data: existingWorkoutSession } = getWorkoutSessionById(
    eventBeingEdited || -1
  );

  const [selectedWorkoutResult, set_selectedWorkoutResult] = useState(
    existingWorkoutSession?.workoutResults[0]?.workout || preselectedWorkouts[0]
  );

  useEffect(() => {
    set_defaultValues({
      id: existingWorkoutSession?.id ?? undefined,
      date: existingWorkoutSession?.event.eventDate ?? eventDate ?? new Date(),
      workoutResults:
        existingWorkoutSession?.workoutResults ??
        preselectedWorkouts.map((workout) => ({
          workout: workout,
          workoutId: workout.id,
        })),
      eventId: existingWorkoutSession?.eventId ?? undefined,
    });
  }, [eventDate, existingWorkoutSession, preselectedWorkouts]);

  useEffect(() => {
    if (showDateTimePicker) {
      datetimePickerRef.current?.focus();
    }
  }, [showDateTimePicker]);

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

  console.log("selected workout result", selectedWorkoutResult);

  return (
    <div className="min-h-[16rem]">
      <div
        style={{
          backgroundImage: `url(/workout-item/${illustration}.png)`,
        }}
        className="absolute top-0 left-0 h-64 w-full bg-cover bg-center opacity-50"
      >
        <div
          style={{
            background:
              "linear-gradient(180deg, rgba(42, 48, 60, 0) 0%, #2A303C 99%)",
          }}
          className="absolute inset-0 h-full w-full"
        ></div>
      </div>

      <div
        onClick={closeForm}
        className="btn-ghost btn-circle btn absolute top-4 left-2"
      >
        <MdArrowBackIosNew size={26} />
      </div>
      <div className="relative mt-10 flex flex-col justify-center">
        <div className="flex items-center justify-center gap-1 font-semibold ">
          {format(getValues("date"), "EEEE, MMM dd, p")}
          <button
            onClick={() => set_showDateTimePicker(true)}
            className="btn-ghost btn-sm btn-circle btn relative"
            type="button"
          >
            <MdEdit size={18} />
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <input
                  className={`input-datetime absolute top-0 h-full w-10  opacity-0`}
                  onChange={(e) => field.onChange(parseISO(e.target.value))}
                  ref={datetimePickerRef}
                  type="datetime-local"
                />
              )}
            />
          </button>
        </div>

        {getValues("workoutResults")?.length > 0 ? (
          <button
            type="button"
            className="btn-primary btn-sm mt-7 self-center rounded-full text-xs font-semibold uppercase"
            onClick={() => {}}
          >
            Save this workout
          </button>
        ) : (
          <button
            type="button"
            className="btn-primary btn-sm mt-7 self-center rounded-full text-xs font-semibold uppercase"
            onClick={() => {
              router.push("workouts");
              setWorkoutSelectionMode(true);
              closeForm();
            }}
          >
            Add a workout
          </button>
        )}

        <div className="mt-6">
          {getValues("workoutResults")?.length > 0 ? (
            <>
              <div className="flex gap-6">
                {getValues("workoutResults").map((workoutResult, index) => {
                  return (
                    <div
                      key={workoutResult.id}
                      className={`${
                        selectedWorkoutResult?.id === workoutResult.workoutId
                          ? ""
                          : "opacity-40"
                      }`}
                    >
                      <div className="flex flex-col">
                        <div className="text-3xl font-bold">
                          {("0" + (index + 1)).slice(-2)}
                        </div>
                        <div className="mb-4 h-1 w-5 rounded-full bg-base-content"></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-base font-semibold">
                  {selectedWorkoutResult?.elementType.includes("STRENGTH") && (
                    <GiBiceps size={14} />
                  )}
                  {selectedWorkoutResult?.elementType?.includes("WOD") && (
                    <BsLightningChargeFill size={14} />
                  )}
                  {selectedWorkoutResult?.elementType?.includes(
                    "ENDURANCE"
                  ) && <FaRunning size={14} />}
                  {enumToString(selectedWorkoutResult?.elementType || "")}
                </div>

                <div className="text-sm uppercase">
                  {selectedWorkoutResult?.totalTime}MN{" "}
                  {enumToString(
                    selectedWorkoutResult?.workoutType || "workout"
                  )}
                </div>

                {/* Save workout result */}
                <div className="-ml-6 mt-4 w-[calc(100%_+_3rem)] bg-base-300 py-4 text-center text-sm font-bold">
                  How was your workout?
                  <input
                    type="range"
                    min="1"
                    max="5"
                    // value="25"
                    onChange={(e) => console.log(e.target.value)}
                    className="range-custom range mt-2 px-3"
                    step="1"
                  />
                  <div className="flex w-full justify-between px-3 text-xl">
                    <span className="opacity-40">😓</span>
                    <span className="opacity-40"></span>
                    <span className="opacity-40"></span>

                    <span className="opacity-40">😍</span>
                  </div>
                </div>

                <div className="mt-6 whitespace-pre-wrap text-xs font-light">
                  {selectedWorkoutResult?.description}
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="pt-14 text-center text-sm font-light leading-loose">
                Don&apos;t have a workout in mind? No problem! Use our
                &quot;Suggest a session&quot; feature that provides a pre-made
                workout session for you. Once you&apos;re done with your
                workout, log your results and watch your progress soar! Our app
                is designed to make working out fun and engaging. So, let&apos;s
                get those endorphins flowing, stay consistent, and crush those
                fitness goals together!
              </p>

              <button
                type="button"
                className="btn-sm btn mt-7 flex items-center gap-2 self-center rounded-full text-xs font-semibold uppercase"
              >
                <MdModelTraining size={19} />
                Suggest a session
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
