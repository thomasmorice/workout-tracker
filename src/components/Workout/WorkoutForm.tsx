import { Difficulty, ElementType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { useEffect, useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { useWorkoutService } from "../../hooks/useWorkoutService";
import { WorkoutWithExtras } from "../../server/router/workout";
import { useToastStore } from "../../store/ToastStore";
import { useWorkoutFormStore } from "../../store/WorkoutFormStore";
import { enumToString } from "../../utils/formatting";
import Modal from "../Layout/Modal";

export default function WorkoutForm() {
  const { addMessage, closeMessage } = useToastStore();
  const {
    state,
    workout: existingWorkout,
    closeWorkoutForm,
    handleWorkoutFormError,
  } = useWorkoutFormStore();

  const { createWorkout, editWorkout, deleteWorkout } = useWorkoutService();

  const defaultValues = useMemo(() => {
    return {
      id: existingWorkout?.id ?? 0,
      name: existingWorkout?.name ?? "",
      description: existingWorkout?.description ?? "",
      difficulty: existingWorkout?.difficulty ?? null,
      totalTime: existingWorkout?.totalTime ?? null,
      elementType: existingWorkout?.elementType ?? "UNCLASSIFIED",
      isDoableAtHome: existingWorkout?.isDoableAtHome ?? false,
    };
  }, [existingWorkout]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<WorkoutWithExtras>({
    defaultValues,
  });

  const handleSave: SubmitHandler<WorkoutWithExtras> = async (
    workout: WorkoutWithExtras
  ) => {
    let toastId;
    try {
      if (state === "edit") {
        toastId = addMessage({
          type: "pending",
          message: "Editing workout",
        });
        await editWorkout.mutateAsync(workout);
        addMessage({
          type: "success",
          message: "Workout edited successfully",
        });
      } else {
        toastId = addMessage({
          message: "Creating workout",
          type: "pending",
        });
        await createWorkout.mutateAsync(workout);
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
  const handleDuplicateAndDelete: SubmitHandler<WorkoutWithExtras> = async (
    workout: WorkoutWithExtras
  ) => {
    workout && (await handleSave(workout));
    workout && (await handleDelete(workout));
  };

  const handleDelete = async (workout: WorkoutWithExtras) => {
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
  };

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  return (
    <>
      {state === "delete" ? (
        <Modal onClose={() => closeWorkoutForm()}>
          <>
            <h3 className="text-xl font-bold capitalize mb-2">
              Delete workout
            </h3>
            <p>Are you sure you wanna delete the workout </p>
            <div className="modal-action">
              <label
                onClick={async () =>
                  existingWorkout && (await handleDelete(existingWorkout))
                }
                className="btn btn-error"
              >
                Yay!
              </label>
              <label onClick={closeWorkoutForm} className="btn">
                Cancel
              </label>
            </div>
          </>
        </Modal>
      ) : (
        // Full Modal Form
        <Modal onClose={closeWorkoutForm}>
          <>
            <h3 className="text-xl font-bold capitalize">{state} a workout</h3>

            <form
              className="mt-5 flex flex-col gap-2"
              onSubmit={async (e) => {
                try {
                  const action = (
                    e.nativeEvent as SubmitEvent
                  ).submitter?.getAttribute("data-action");
                  if (action === "save") {
                    await handleSubmit(handleSave)(e);
                  } else if (action == "duplicate-and-delete") {
                    await handleSubmit(handleDuplicateAndDelete)(e);
                  }
                  closeWorkoutForm();
                } catch (e) {
                  console.error(e);
                }
              }}
            >
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  className="input"
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
                  className="textarea"
                  rows={4}
                  maxRows={12}
                  placeholder="5 rounds of..."
                />
              </div>

              <div className="flex gap-4 flex-wrap w-full">
                <div className="form-control relative flex-1">
                  <label className="label">
                    <span className="label-text">Difficulty</span>
                  </label>
                  <select {...register("difficulty")} className="select">
                    <option disabled value="">
                      Select a difficulty
                    </option>
                    {Object.keys(Difficulty).map((difficulty) => (
                      <option key={difficulty} value={difficulty}>
                        {enumToString(difficulty).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control relative flex-1">
                  <label className="label">
                    <span className="label-text">Type of element</span>
                  </label>
                  <select {...register("elementType")} className="select">
                    {Object.keys(ElementType).map((element) => (
                      <option key={element} value={element}>
                        {enumToString(element).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-control relative w-full">
                <label className="label">
                  <span className="label-text">Total time</span>
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    className="input max-w-[110px] flex-1"
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

              {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}

              <div className="mt-3 flex justify-end gap-4 flex-wrap">
                <button
                  data-action="save"
                  className={`btn mt-2 ${isSubmitting ? "loading" : ""}`}
                  type="submit"
                >
                  {`${state} workout`}
                </button>
                {state === "duplicate" && (
                  <button
                    data-action="duplicate-and-delete"
                    className={`btn btn-error mt-2 ${
                      isSubmitting ? "loading" : ""
                    }`}
                    type="submit"
                  >
                    Duplicate & Delete Original
                  </button>
                )}
              </div>
            </form>
          </>
        </Modal>
      )}
    </>
  );
}
