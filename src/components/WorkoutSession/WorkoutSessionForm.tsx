import { useEffect, useState } from "react";
import {
  MdArrowBackIosNew,
  MdEdit,
  MdModelTraining,
  MdOpenInNew,
} from "react-icons/md";
import { getRandomPreparingSessionllustration } from "../../utils/workout";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { inferRouterInputs, inferRouterOutputs, TRPCError } from "@trpc/server";
import { WorkoutSessionRouterType } from "../../server/trpc/router/workout-session-router";
import {
  CreateWorkoutSessionInputSchema,
  WorkoutResultInputsWithWorkout,
} from "../../types/app";
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
import { motion } from "framer-motion";
import { Rings } from "react-loading-icons";
import WorkoutResultCard from "../WorkoutResult/WorkoutResultCard";
import { workoutResultIsFilled } from "../../utils/utils";
import { Reorder } from "framer-motion";
import { z } from "zod";
import { useToastStore } from "../../store/ToastStore";
import { EventRouterType } from "../../server/trpc/router/event-router";
import WorkoutResultForm from "../WorkoutResult/WorkoutResultForm";
import { TRPCClientError } from "@trpc/client";

type WorkoutSessionFormProps = {
  // create?: boolean;
  existingSessionId?: inferRouterOutputs<EventRouterType>["getEvents"][number]["id"];
  onSuccess?: () => void;
};

export default function WorkoutSessionForm({
  existingSessionId,
  onSuccess,
}: WorkoutSessionFormProps) {
  const { data: sessionData } = useSession();
  const [illustration] = useState(getRandomPreparingSessionllustration());
  const [defaultValues, set_defaultValues] = useState({});
  const router = useRouter();

  const {
    selectedWorkouts: preselectedWorkouts,
    setWorkoutSelectionMode,
    openWorkoutDetail,
  } = useWorkoutStore();
  const { eventDate, closeForm } = useEventStore();
  const { addMessage, closeMessage } = useToastStore();

  const {
    data: existingWorkoutSession,
    isInitialLoading,
    isLoading,
  } = trpc.workoutSession.getWorkoutSessionById.useQuery(
    {
      id: existingSessionId || -1,
    },
    {
      enabled: sessionData?.user !== undefined && !!existingSessionId,
      refetchOnWindowFocus: false,
    }
  );

  const { mutateAsync: addOrEditWorkoutSession } =
    trpc.workoutSession.addOrEdit.useMutation({
      async onSuccess() {
        // await utils.workout.getInfiniteWorkout.invalidate();
      },
      onError(e: unknown) {
        addMessage({
          message: (e as TRPCError).message,
          type: "error",
        });
      },
    });

  const { mutateAsync: addOrEditManyWOrkoutResults } =
    trpc.workoutResult.addOrEditMany.useMutation({
      async onSuccess() {
        // await utils.workout.getInfiniteWorkout.invalidate();
      },
      onError(e: unknown) {
        addMessage({
          message: (e as TRPCError).message,
          type: "error",
        });
      },
    });

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

  const [selectedWorkoutResultIndex, set_selectedWorkoutResultIndex] =
    useState(0);
  const [editSelectedWorkoutResult, set_editSelectedWorkoutResult] =
    useState(false);
  const [previousSelectedIndex, set_previousSelectedIndex] = useState(
    selectedWorkoutResultIndex
  );

  const {
    fields: workoutResults,
    replace: replaceWorkoutResults,
    update: updateWorkoutResults,
  } = useFieldArray({
    keyName: "key",
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "workoutResults", // unique name for your Field Array
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const selectedWorkoutResult = workoutResults[selectedWorkoutResultIndex];

  const switchSelectedWorkoutResult = (index: number) => {
    if (index < workoutResults.length && index >= 0) {
      set_previousSelectedIndex(selectedWorkoutResultIndex);
      set_selectedWorkoutResultIndex(index);
    }
  };

  useEffect(() => {
    console.log("selectedWorkoutResult", selectedWorkoutResult);
  }, [selectedWorkoutResult]);

  if (isInitialLoading) {
    return (
      <div className=" flex h-screen w-screen items-center justify-center">
        <Rings strokeWidth={1.5} width={64} height={64} />
      </div>
    );
  }

  const handleCreateOrEdit: SubmitHandler<
    z.infer<typeof CreateWorkoutSessionInputSchema>
  > = async (
    workoutSession: z.infer<typeof CreateWorkoutSessionInputSchema>
  ) => {
    const toastId = addMessage({
      type: "pending",
      message: `${existingWorkoutSession ? "Editing" : "Creating"} session`,
    });
    try {
      const savedWorkoutSession = await addOrEditWorkoutSession(workoutSession);

      if (workoutSession.workoutResults?.length ?? 0 > 0) {
        await addOrEditManyWOrkoutResults({
          workoutResults: workoutSession.workoutResults,
          workoutSessionId: savedWorkoutSession.id,
        });
        addMessage({
          type: "success",
          message: `Session ${existingSessionId ? "edited" : "created"}`,
        });
      }
    } catch (e) {
      if (e instanceof TRPCClientError) {
        addMessage({
          type: "error",
          message: e.message,
        });
      }
    } finally {
      reset(defaultValues);
      toastId && closeMessage(toastId);
    }
  };

  const openWorkoutResultForm = (rating: number) => {
    updateWorkoutResults(selectedWorkoutResultIndex, {
      ...(selectedWorkoutResult as WorkoutResultInputsWithWorkout),
      rating,
    });
    set_editSelectedWorkoutResult(true);
  };

  return (
    <div className="">
      {editSelectedWorkoutResult && (
        <WorkoutResultForm
          onSave={(workoutResult) => {
            updateWorkoutResults(selectedWorkoutResultIndex, workoutResult);
            // handleSubmit(handleCreateOrEdit)();
            set_editSelectedWorkoutResult(false);
          }}
          onClose={() => set_editSelectedWorkoutResult(false)}
          workoutResult={
            selectedWorkoutResult as WorkoutResultInputsWithWorkout
            // workoutResults[
            //   editWorkoutResultIndex
            // ] as WorkoutResultInputsWithWorkout
          }
        />
      )}
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
        onClick={() => router.back()}
        className="btn btn-ghost btn-circle fixed top-4 left-2"
      >
        <MdArrowBackIosNew size={26} />
      </div>
      <div className="relative mt-16 flex flex-col justify-center ">
        <DatePicker name="date" control={control} />

        {workoutResults.length ? (
          <div className=" mt-7 flex justify-center gap-3 ">
            {isDirty && (
              <button
                onClick={() => reset()}
                className="btn-ghost btn-sm rounded-full font-semibold uppercase"
              >
                Cancel
              </button>
            )}

            <button
              type="button"
              className={`btn-primary btn-sm  rounded-full text-xs font-semibold uppercase ${
                isDirty ? "" : "btn-disabled"
              }`}
              disabled={!isDirty}
              onClick={async () => {
                await handleSubmit(handleCreateOrEdit)();
                onSuccess && onSuccess();
              }}
            >
              {`${existingSessionId ? "Unsaved changes" : "Create a session"} `}
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn-primary btn-sm mt-7 self-center rounded-full text-xs font-semibold uppercase"
            onClick={() => {
              router.push("/workouts");
              setWorkoutSelectionMode(true);
              closeForm();
            }}
          >
            Add a workout
          </button>
        )}

        <div className="mt-6 ">
          {workoutResults.length ? (
            <>
              <Reorder.Group
                axis="x"
                className="flex gap-6"
                values={workoutResults}
                onReorder={(reorderedResults) => {
                  replaceWorkoutResults(reorderedResults);
                }}
              >
                {workoutResults.map((workoutResult, index) => {
                  return (
                    <Reorder.Item
                      key={workoutResult.workout.id}
                      value={workoutResult}
                      onClick={() => {
                        set_previousSelectedIndex(selectedWorkoutResultIndex);
                        set_selectedWorkoutResultIndex(index);
                      }}
                      className={`flex gap-6 ${
                        selectedWorkoutResultIndex === index ? "" : "opacity-30"
                      }`}
                    >
                      <div className="flex flex-col">
                        <div className="text-3xl font-bold">
                          {("0" + (index + 1)).slice(-2)}
                          {/* {workoutResult.workout.description.substring(0, 10)} */}
                        </div>
                        {selectedWorkoutResultIndex === index && (
                          <div className="mb-4 h-1 w-5 rounded-full bg-base-content"></div>
                        )}
                      </div>
                    </Reorder.Item>
                  );
                })}
              </Reorder.Group>

              {selectedWorkoutResult && (
                <>
                  <div className="mt-3 mb-5">
                    {workoutResultIsFilled(selectedWorkoutResult) ? (
                      <div className="-ml-3 w-[calc(100%_+_1.5rem)]">
                        <WorkoutResultCard
                          onEdit={() => set_editSelectedWorkoutResult(true)}
                          condensed
                          result={selectedWorkoutResult}
                        />
                      </div>
                    ) : (
                      <div className="btn-group flex">
                        <button
                          onClick={() => openWorkoutResultForm(1)}
                          className="btn btn-sm w-1/5 text-xl"
                        >
                          😓
                        </button>
                        <button
                          onClick={() => openWorkoutResultForm(2)}
                          className="btn btn-sm w-1/5 text-xl"
                        >
                          🙁
                        </button>
                        <button
                          onClick={() => openWorkoutResultForm(3)}
                          className="btn btn-sm w-1/5 text-xl"
                        >
                          😐
                        </button>
                        <button
                          onClick={() => openWorkoutResultForm(4)}
                          className="btn btn-sm w-1/5 text-xl"
                        >
                          🙂
                        </button>
                        <button
                          onClick={() => openWorkoutResultForm(5)}
                          className="btn btn-sm w-1/5 text-xl"
                        >
                          😍
                        </button>
                      </div>
                    )}
                  </div>
                  <motion.div
                    key={selectedWorkoutResultIndex}
                    className="flex w-full flex-col"
                    drag="x"
                    dragConstraints={{
                      left: 0,
                      right: 0,
                    }}
                    onDrag={(_evt, info) => {
                      if (info.offset.x > 50) {
                        switchSelectedWorkoutResult(
                          selectedWorkoutResultIndex - 1
                        );
                      } else if (info.offset.x < -50) {
                        switchSelectedWorkoutResult(
                          selectedWorkoutResultIndex + 1
                        );
                      }
                    }}
                    initial={{
                      x:
                        previousSelectedIndex === selectedWorkoutResultIndex
                          ? 0
                          : previousSelectedIndex > selectedWorkoutResultIndex
                          ? -40
                          : 40,
                      opacity:
                        previousSelectedIndex === selectedWorkoutResultIndex
                          ? 1
                          : 0,
                    }}
                    animate={{
                      x: 0,
                      opacity: 1,
                    }}
                    exit={{
                      x:
                        previousSelectedIndex > selectedWorkoutResultIndex
                          ? -40
                          : 40,
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
                      <button
                        onClick={() =>
                          openWorkoutDetail(selectedWorkoutResult?.workout)
                        }
                        className="btn btn-ghost btn-sm btn-circle"
                      >
                        <MdOpenInNew size={17} />
                      </button>
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
                    <div className="mt-6 whitespace-pre-wrap text-xs leading-relaxed">
                      {selectedWorkoutResult?.workout?.description}
                    </div>
                  </motion.div>
                </>
              )}
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
