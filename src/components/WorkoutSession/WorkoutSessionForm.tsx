import { format, parseISO } from "date-fns";
import { useCallback, useEffect, useRef, useState } from "react";
import { MdArrowBackIosNew, MdEdit, MdModelTraining } from "react-icons/md";
import { getRandomPreparingSessionllustration } from "../../utils/workout";
import { Controller, useForm, useFieldArray } from "react-hook-form";
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
import DatePicker from "../DatePicker/DatePicker";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";

type WorkoutSessionFormProps = {
  onSuccess?: () => void;
};

export default function WorkoutSessionForm({
  onSuccess,
}: WorkoutSessionFormProps) {
  const { data: sessionData } = useSession();
  const [illustration] = useState(getRandomPreparingSessionllustration());
  const [defaultValues, set_defaultValues] = useState({});
  const router = useRouter();

  const { selectedWorkouts: preselectedWorkouts, setWorkoutSelectionMode } =
    useWorkoutStore();
  const { eventBeingEdited, eventDate, closeForm } = useEventStore();

  const { data: existingWorkoutSession } =
    trpc.workoutSession.getWorkoutSessionById.useQuery(
      {
        id: eventBeingEdited || -1,
      },
      {
        enabled: sessionData?.user !== undefined && !!eventBeingEdited,
        refetchOnWindowFocus: false,
      }
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

  console.log("existingWorkoutSession", existingWorkoutSession);

  const [selectedIndex, set_selectedIndex] = useState(0);
  const [previousSelectedIndex, set_previousSelectedIndex] =
    useState(selectedIndex);

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

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  // useEffect(() => {
  //   console.log("workoutResults", workoutResults);
  // }, [workoutResults]);
  // useEffect(() => {

  // }, [selectedIndex])

  const selectedWorkoutResult = workoutResults[selectedIndex];

  const switchSelectedWorkoutResult = (index: number) => {
    if (index < workoutResults.length && index >= 0) {
      set_previousSelectedIndex(selectedIndex);
      set_selectedIndex(index);
    }
  };

  return (
    <div className="min-h-screen">
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
        className="btn btn-ghost btn-circle absolute top-4 left-2"
      >
        <MdArrowBackIosNew size={26} />
      </div>
      <div className="relative mt-10 flex flex-col justify-center ">
        <DatePicker name="date" control={control} />

        {workoutResults.length ? (
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
          {workoutResults.length ? (
            <>
              <div className="flex gap-6">
                {workoutResults.map((workoutResult, index) => {
                  return (
                    <div
                      key={workoutResult.id}
                      onClick={() => {
                        set_previousSelectedIndex(selectedIndex);
                        set_selectedIndex(index);
                      }}
                      className={`transition-opacity duration-300 ${
                        selectedIndex === index ? "" : "opacity-40"
                      }`}
                    >
                      <div className="flex flex-col">
                        <div className="text-3xl font-bold">
                          {("0" + (index + 1)).slice(-2)}
                        </div>
                        <div className="mb-4 h-1 w-5 rounded-full bg-base-content"></div>
                      </div>

                      {/* Save workout result */}

                      {/* <div className="-ml-6 mt-4 w-[calc(100%_+_3rem)] bg-base-300 py-4 text-center text-sm font-bold">
                        How was your workout?
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={selectedWorkoutResult?.rating + ""}
                          onChange={(e) =>
                            updateWorkoutResults(selectedIndex, {
                              ...selectedWorkoutResult,
                              rating: parseInt(e.target.value),
                            } as WorkoutResultInputsWithWorkout)
                          }
                          className="range-custom range mt-2 px-3"
                          step="1"
                        />
                        <div className="flex w-full justify-between px-3 text-xl">
                          <span className="opacity-40">😓</span>
                          <span className="opacity-40"></span>
                          <span className="opacity-40"></span>

                          <span className="opacity-40">😍</span>
                        </div>
                      </div> */}
                    </div>
                  );
                })}
              </div>

              <AnimatePresence initial={false} mode="wait">
                {selectedWorkoutResult && (
                  <motion.div
                    className="absolute flex w-full flex-col"
                    key={selectedWorkoutResult.key}
                    drag="x"
                    dragConstraints={{
                      left: 0,
                      right: 0,
                    }}
                    onDragEnd={(_evt, info) => {
                      if (info.offset.x > 50) {
                        switchSelectedWorkoutResult(selectedIndex - 1);
                      } else {
                        switchSelectedWorkoutResult(selectedIndex + 1);
                      }
                    }}
                    initial={{
                      x: previousSelectedIndex > selectedIndex ? -40 : 40,
                      opacity: 0,
                    }}
                    animate={{
                      x: 0,
                      opacity: 1,
                      // transition: {
                      //   delay: 0.15,
                      // },
                    }}
                    exit={{
                      x: previousSelectedIndex > selectedIndex ? -40 : 40,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                  >
                    <div className="flex items-center gap-2 text-base font-semibold">
                      {selectedWorkoutResult?.workout.elementType.includes(
                        "STRENGTH"
                      ) && <GiBiceps size={14} />}
                      {selectedWorkoutResult.workout.elementType?.includes(
                        "WOD"
                      ) && <BsLightningChargeFill size={14} />}
                      {selectedWorkoutResult.workout.elementType?.includes(
                        "ENDURANCE"
                      ) && <FaRunning size={14} />}
                      {enumToString(
                        selectedWorkoutResult.workout.elementType || ""
                      )}
                    </div>
                    {selectedWorkoutResult.workout.totalTime && (
                      <div className="text-sm uppercase">
                        {selectedWorkoutResult.workout.totalTime}
                        MN{" "}
                        {enumToString(
                          selectedWorkoutResult.workout.workoutType || "workout"
                        )}
                      </div>
                    )}
                    <div className="mt-6 whitespace-pre-wrap text-xs font-light">
                      {selectedWorkoutResult?.workout?.description}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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

              <div className="flex w-full justify-center">
                <button
                  type="button"
                  disabled
                  className="btn btn-disabled btn-sm mt-7 rounded-full text-center text-xs font-semibold uppercase"
                >
                  <MdModelTraining size={19} />
                  Suggest a session (soon)
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
