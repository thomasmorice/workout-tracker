import { Difficulty, ElementType, Workout } from "@prisma/client";
import { useEffect, useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { useWorkoutService } from "../../hooks/useWorkoutService";
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
  } = useWorkoutFormStore();

  const { createWorkout, editWorkout, deleteWorkout, onError, onSuccess } =
    useWorkoutService();

  useEffect(() => {
    if (onError) {
      if (
        onError.message.includes(
          "Unique constraint failed on the fields: (`description`)"
        )
      ) {
        addMessage({
          type: "error",
          message: "A workout with this description already exists",
          closeAfter: 7000,
        });
      } else {
        addMessage({
          type: "error",
          message: onError.message,
          closeAfter: 7000,
        });
      }
    }
  }, [onError, addMessage]);

  useEffect(() => {
    if (onSuccess) {
      closeWorkoutForm();
    }
  }, [onSuccess, closeWorkoutForm]);

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
  } = useForm<Workout>({
    defaultValues,
  });

  const onSave: SubmitHandler<Workout> = async (workout: Workout) => {
    let toastId;
    try {
      if (state === "edit") {
        toastId = addMessage({
          message: "Editing workout",
          type: "pending",
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
    } finally {
      toastId && closeMessage(toastId);
    }
  };
  const onDuplicateAndDelete: SubmitHandler<Workout> = async (
    workout: Workout
  ) => {
    await onSave(workout);
  };

  const handleDelete = async () => {
    const toastId = addMessage({
      message: "Deleting workout",
      type: "pending",
    });
    existingWorkout && (await deleteWorkout.mutateAsync(existingWorkout));
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
            <h3 className="text-xl font-bold capitalize">Delete workout</h3>
            <p>Are you sure you wanna delete the workout </p>
            <div className="modal-action">
              <label
                onClick={async () => await handleDelete()}
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
              onSubmit={(e) => {
                const action = (
                  e.nativeEvent as SubmitEvent
                ).submitter?.getAttribute("data-action");
                if (action === "save") {
                  void handleSubmit(onSave)(e);
                } else if (action == "duplicate-and-delete") {
                  void handleSubmit(onDuplicateAndDelete)(e);
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
                {/* <textarea

        ></textarea> */}
              </div>

              <div className="form-control relative w-full">
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

              <div className="form-control relative w-full">
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

              <div className="form-control relative w-full">
                <label className="label">
                  <span className="label-text">Total time</span>
                </label>
                <div
                  onClick={() =>
                    addMessage({
                      message: "Test",
                      type: "info",
                    })
                  }
                  className="flex flex-wrap items-center gap-2"
                >
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

                  <div className="flex">
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
              </div>

              {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}

              <div className="mt-3 flex justify-end gap-4">
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
                <button
                  data-action="save"
                  className={`btn mt-2 ${isSubmitting ? "loading" : ""}`}
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
