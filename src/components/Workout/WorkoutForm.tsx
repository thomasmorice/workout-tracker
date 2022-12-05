import { Difficulty, ElementType, WorkoutType } from "@prisma/client";
import { inferRouterInputs, TRPCError } from "@trpc/server";
import { useEffect, useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { useWorkoutService } from "../../services/useWorkoutService";
import { useToastStore } from "../../store/ToastStore";
import { useWorkoutStore } from "../../store/WorkoutStore";
import { enumToString } from "../../utils/formatting";
import Modal from "../Layout/Navigation/Modal/Modal";
import ConfirmModal from "../Layout/Navigation/Modal/ConfirmModal";
import { WorkoutRouterType } from "../../server/trpc/router/workout-router";

export default function WorkoutForm() {
  const { addMessage, closeMessage } = useToastStore();
  const {
    state,
    workout: existingWorkout,
    closeWorkoutForm,
    handleWorkoutFormError,
  } = useWorkoutStore();

  const { createWorkout, editWorkout, deleteWorkout } = useWorkoutService();

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
        editWorkout.mutateAsync(
          workout as inferRouterInputs<WorkoutRouterType>["edit"]
        );
        addMessage({
          type: "success",
          message: "Workout edited successfully",
        });
      } else {
        const { id, ...workoutWithoutId } = workout;
        await createWorkout.mutateAsync(workoutWithoutId);
        addMessage({
          type: "success",
          message: "Workout created successfully",
        });
      }
    } catch (e) {
      handleWorkoutFormError(e as TRPCError);
      throw e;
    } finally {
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
    await deleteWorkout.mutateAsync(workout);
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
      {state === "delete" ? (
        <ConfirmModal
          onClose={closeWorkoutForm}
          title="Delete workout"
          onConfirm={async () =>
            existingWorkout && (await handleDelete(existingWorkout))
          }
        >
          <p>Are you sure you wanna delete the workout </p>
        </ConfirmModal>
      ) : (
        // Full Modal Form
        <Modal onClose={closeWorkoutForm}>
          <>
            <h3 className="text-xl font-bold capitalize">{state} a workout</h3>

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
                  className="input-bordered input placeholder:opacity-50"
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
                  className="input-bordered textarea placeholder:opacity-50"
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
                    className="select-bordered select"
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
                    className="select-bordered select"
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
                  className="select-bordered select"
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
                    className="input-bordered input max-w-[110px] flex-1 placeholder:opacity-50"
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
                <button className="btn" onClick={closeWorkoutForm}>
                  Cancel
                </button>
                <button
                  className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
                  type="submit"
                >
                  {`${state} workout`}
                </button>
              </div>
            </form>
          </>
        </Modal>
      )}
    </>
  );
}
