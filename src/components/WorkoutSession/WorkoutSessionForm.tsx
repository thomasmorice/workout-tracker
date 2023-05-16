import { useEffect, useRef, useState } from "react";
import { MdCancel, MdModelTraining, MdStar, MdWarning } from "react-icons/md";
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
import { enumToString } from "../../utils/formatting";
import DatePicker from "../DatePicker/DatePicker";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";
import { Rings } from "react-loading-icons";
import { workoutResultIsFilled } from "../../utils/utils";
import { Reorder } from "framer-motion";
import { z } from "zod";
import { useToastStore } from "../../store/ToastStore";
import { EventRouterType } from "../../server/trpc/router/event-router";
import WorkoutResultForm from "../WorkoutResult/WorkoutResultForm";
import { TRPCClientError } from "@trpc/client";
import WorkoutCard from "../Workout/WorkoutCard/WorkoutCard";
import Dropdown from "../Dropdown/Dropdown";
import { format, isAfter } from "date-fns";
import Image from "next/image";
import { RxDotsVertical } from "react-icons/rx";
import WorkoutResult from "../Workout/WorkoutCard/WorkoutResult";
import Modal from "../Layout/Modal/Modal";
import ConfirmModal from "../Layout/Modal/ConfirmModal";

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

  const [defaultValues, set_defaultValues] = useState({});
  const router = useRouter();

  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const [showWorkoutResultForm, set_showWorkoutResultForm] =
    useState<WorkoutResultInputsWithWorkout>();

  const [reorderWorkoutMode, set_reorderWorkoutMode] = useState(false);

  const { selectedWorkouts: preselectedWorkouts } = useWorkoutStore();
  const { eventDate } = useEventStore();
  const { addMessage, closeMessage } = useToastStore();
  const utils = trpc.useContext();

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
      onError(e: unknown) {
        addMessage({
          message: (e as TRPCError).message,
          type: "error",
        });
      },
    });

  const { mutateAsync: addOrEditManyWorkoutResults } =
    trpc.workoutResult.addOrEditMany.useMutation({
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

  watch("date"); // Keep track of this change

  const {
    fields: workoutResults,
    replace: replaceWorkoutResults,
    remove: removeWorkoutResults,
    update: updateWorkoutResults,
  } = useFieldArray({
    keyName: "key",
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "workoutResults", // unique name for your Field Array
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const isSessionInTheFuture = isAfter(getValues("date"), new Date());

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
        await addOrEditManyWorkoutResults({
          workoutResults: workoutSession.workoutResults,
          workoutSessionId: savedWorkoutSession.id,
        });
        addMessage({
          type: "success",
          message: `Session ${existingSessionId ? "edited" : "created"}`,
        });
      }

      if (!existingSessionId) {
        router.push(`/session/edit/${savedWorkoutSession.id}`);
      } else {
        await utils.workoutSession.getWorkoutSessionById.invalidate();
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

  return (
    <div className="">
      {showWorkoutResultForm && (
        <WorkoutResultForm
          onSave={(workoutResult) => {
            updateWorkoutResults(
              workoutResults.findIndex(
                (wr) => wr.workoutId === workoutResult.workoutId
              ),
              workoutResult
            );
            set_showWorkoutResultForm(undefined);
          }}
          onClose={() => set_showWorkoutResultForm(undefined)}
          workoutResult={showWorkoutResultForm}
        />
      )}

      <div className="relative mt-2 flex flex-col justify-center ">
        {workoutResults.length && (
          <>
            <div className="text-lg font-bold text-white">
              <DatePicker name="date" control={control} />
            </div>

            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <span className="label-text">
                  Change the order of the workouts
                </span>
                <input
                  type="checkbox"
                  onClick={() => set_reorderWorkoutMode(!reorderWorkoutMode)}
                  className="toggle"
                  checked={reorderWorkoutMode}
                />
              </label>
            </div>

            {isDirty && (
              <div className="flex gap-2">
                <div
                  onClick={() =>
                    saveButtonRef.current?.scrollIntoView({
                      behavior: "smooth",
                    })
                  }
                  className="badge badge-warning mb-4 mt-2 flex cursor-pointer gap-1"
                >
                  <MdWarning /> You have unsaved changes{" "}
                </div>
                <div
                  onClick={() => reset(defaultValues)}
                  className="badge badge-error mb-4 mt-2 flex cursor-pointer gap-1"
                >
                  <MdCancel /> Cancel
                </div>
              </div>
            )}

            <div className="">
              <Reorder.Group
                axis="y"
                className="mt-3 flex flex-col gap-5"
                values={workoutResults}
                onReorder={(reorderedResults) => {
                  replaceWorkoutResults(reorderedResults);
                }}
              >
                {workoutResults.map((workoutResult, index) => {
                  return (
                    <Reorder.Item
                      key={workoutResult.workoutId}
                      value={workoutResult}
                      dragListener={reorderWorkoutMode}
                    >
                      <WorkoutCard
                        isDraggable={reorderWorkoutMode}
                        isWorkoutFromSessionForm
                        canRemoveWorkoutFromSession={!existingWorkoutSession}
                        workout={workoutResult.workout}
                        onRemoveWorkoutFromSession={() =>
                          removeWorkoutResults(index)
                        }
                        onEditWorkoutResult={() =>
                          set_showWorkoutResultForm(workoutResult)
                        }
                        workoutResult={
                          <WorkoutResult
                            workoutResult={workoutResult}
                            onEditWorkoutResult={() =>
                              set_showWorkoutResultForm(workoutResult)
                            }
                          />
                        }
                      />
                    </Reorder.Item>
                  );
                })}
              </Reorder.Group>
            </div>

            {(isDirty || !existingSessionId) && (
              <button
                ref={saveButtonRef}
                onClick={async () => {
                  await handleSubmit(handleCreateOrEdit)();
                }}
                type="button"
                className="btn-primary btn-sm btn mt-6 w-full"
              >
                {isSessionInTheFuture
                  ? "Plan this session"
                  : existingSessionId
                  ? "Save changes"
                  : "Save this session"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
