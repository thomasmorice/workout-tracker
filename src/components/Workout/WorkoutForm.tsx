import { Difficulty, ElementType, WorkoutType } from "@prisma/client";
import { inferRouterInputs, TRPCError } from "@trpc/server";
import { useEffect, useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { useToastStore } from "../../store/ToastStore";
import { useWorkoutStore } from "../../store/WorkoutStore";
import { enumToString } from "../../utils/formatting";
import Modal from "../Layout/Modal/Modal";
import ConfirmModal from "../Layout/Modal/ConfirmModal";
import { WorkoutRouterType } from "../../server/trpc/router/WorkoutRouter/workout-router";
import { trpc } from "../../utils/trpc";
import { TRPCClientError } from "@trpc/client";

export default function WorkoutForm() {
  const { addMessage, closeMessage } = useToastStore();
  const {
    state,
    workout: existingWorkout,
    closeWorkoutForm,
    handleWorkoutFormError,
  } = useWorkoutStore();

  const handleError = (e: any) => {
    if (e instanceof TRPCClientError) {
      const errors = JSON.parse(e.message);
      addMessage({
        type: "error",
        message: errors[0].message || "unknown error",
      });
    }
  };

  const { mutateAsync: addWorkout } = trpc.workout.add.useMutation({
    async onSuccess() {
      await utils.workout.getInfiniteWorkout.invalidate();
    },
  });

  const { mutateAsync: editWorkout } = trpc.workout.edit.useMutation({
    async onSuccess() {
      await utils.workout.getInfiniteWorkout.invalidate();
    },
  });

  const { mutateAsync: deleteWorkout } = trpc.workout.delete.useMutation({
    async onSuccess() {
      await utils.workout.getInfiniteWorkout.invalidate();
    },
  });

  const utils = trpc.useContext();

  const defaultValues: inferRouterInputs<WorkoutRouterType>["add"] =
    useMemo(() => {
      return {
        id: existingWorkout?.id ?? undefined,
        name: existingWorkout?.name ?? "",
        description: existingWorkout?.description ?? "",
        difficulty: existingWorkout?.difficulty ?? null,
        totalTime: existingWorkout?.totalTime ?? null,
        workoutType: existingWorkout?.workoutType ?? null,
        elementType: existingWorkout?.elementType ?? "UNCLASSIFIED",
        isDoableAtHome: existingWorkout?.isDoableAtHome ?? false,
      };
    }, [existingWorkout]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<
    | inferRouterInputs<WorkoutRouterType>["add"]
    | inferRouterInputs<WorkoutRouterType>["edit"]
  >({
    defaultValues,
  });

  const handleSave: SubmitHandler<
    | inferRouterInputs<WorkoutRouterType>["add"]
    | inferRouterInputs<WorkoutRouterType>["edit"]
  > = async (workout) => {
    const toastId = addMessage({
      type: "pending",
      message: `${state} workout`,
    });
    try {
      if (state === "edit") {
        editWorkout(workout as inferRouterInputs<WorkoutRouterType>["edit"]);

        addMessage({
          type: "success",
          message: "Workout edited successfully",
        });
      } else {
        const { id, ...workoutWithoutId } = workout;
        await addWorkout(workoutWithoutId);

        addMessage({
          type: "success",
          message: "Workout created successfully",
        });
      }
    } catch (e) {
      handleError(e);
      throw e;
    } finally {
      reset(defaultValues);
      toastId && closeMessage(toastId);
    }
  };

  const handleDelete = async (
    workout: inferRouterInputs<WorkoutRouterType>["delete"]
  ) => {
    const toastId = addMessage({
      message: "Deleting workout",
      type: "pending",
    });

    deleteWorkout(workout);

    closeMessage(toastId);
    addMessage({
      message: "Deleted successfully",
      type: "success",
    });
    closeWorkoutForm();
  };

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  return (
    <>
      <ConfirmModal
        isOpen={state === "delete"}
        onClose={closeWorkoutForm}
        title="Delete workout"
        onConfirm={async () =>
          existingWorkout && (await handleDelete(existingWorkout))
        }
      >
        <p>Are you sure you wanna delete the workout </p>
      </ConfirmModal>

      <Modal
        title={state && `${state} a workout`}
        isOpen={!!state && state !== "delete"}
        onClose={closeWorkoutForm}
      >
        <>
          <form
            className="mt-5 flex flex-col gap-2"
            onSubmit={async (e) => {
              try {
                await handleSubmit(handleSave)(e);
                closeWorkoutForm();
              } catch (e) {
                console.error(e);
              }
            }}
          >
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">
                  Name{""}
                  <span className="ml-2 text-xs opacity-60">optional</span>
                </span>
              </label>
              <input
                className="input bg-base-200 placeholder:opacity-50"
                placeholder="Grace..."
                defaultValue=""
                {...register("name")}
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Description</span>
              </label>

              <TextareaAutosize
                {...register("description")}
                className="textarea bg-base-200 placeholder:opacity-50"
                rows={4}
                maxRows={12}
                placeholder="5 rounds of..."
              />
            </div>

            <div className="flex w-full flex-wrap gap-4">
              <div className="form-control relative flex-1">
                <label className="label">
                  <span className="label-text">
                    Difficulty
                    <span className="ml-2 text-xs opacity-60">optional</span>
                  </span>
                </label>
                <select
                  {...register("difficulty", {
                    setValueAs: (value) => (value === "" ? null : value),
                  })}
                  className="select bg-base-200"
                >
                  <option value={""}>Select a difficulty</option>
                  {Object.keys(Difficulty).map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {enumToString(difficulty).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control relative flex-1">
                <label className="label">
                  <span className="label-text">
                    Type of element
                    <span className="ml-2 text-xs opacity-60">optional</span>
                  </span>
                </label>
                <select
                  {...register("elementType", {
                    setValueAs: (value) => (value === "" ? null : value),
                  })}
                  className="select bg-base-200"
                >
                  {Object.keys(ElementType).map((element) => (
                    <option key={element} value={element}>
                      {enumToString(element).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-control relative flex-1">
              <label className="label">
                <span className="label-text">
                  Type of workout
                  <span className="ml-2 text-xs opacity-60">optional</span>
                </span>
              </label>
              <select
                {...register("workoutType", {
                  setValueAs: (value) => (value === "" ? null : value),
                })}
                className="select bg-base-200"
              >
                <option disabled value="">
                  Select a workout type
                </option>
                {Object.keys(WorkoutType).map((type) => (
                  <option key={type} value={type}>
                    {enumToString(type).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control relative w-full">
              <label className="label">
                <span className="label-text">
                  Total time
                  <span className="ml-2 text-xs opacity-60">optional</span>
                </span>
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  className="input max-w-[110px] flex-1 bg-base-200 placeholder:opacity-50"
                  placeholder="12"
                  type={"number"}
                  defaultValue=""
                  step="0.5"
                  {...register("totalTime", {
                    setValueAs: (v) => {
                      return v === null || v === ""
                        ? null
                        : parseFloat(v as string);
                    },
                  })}
                />
                <span className="mr-3"> mn</span>

                <label className="label cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("isDoableAtHome")}
                    className="checkbox bg-base-100"
                  />
                  <span className="label-text ml-2">Do-able at home </span>
                </label>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap justify-end gap-4">
              <button
                type={"button"}
                className="btn"
                onClick={closeWorkoutForm}
              >
                Cancel
              </button>
              <button
                className={`btn-primary btn ${isSubmitting ? "loading" : ""}`}
                type="submit"
              >
                {`${state} workout`}
              </button>
            </div>
          </form>
        </>
      </Modal>
    </>
  );
}
