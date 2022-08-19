import { WorkoutSession } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useWorkoutSessionFormStore } from "../../../store/WorkoutSessionFormStore";
import Modal from "../Modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDebounce } from "usehooks-ts";
import { useWorkoutService } from "../../../services/useWorkoutService";
import { format } from "date-fns";
import { Rings } from "react-loading-icons";

export default function WorkoutSessionForm() {
  const { state, session: existingSession } = useWorkoutSessionFormStore();

  const [searchTerm, set_searchTerm] = useState("");
  const [showWorkoutSearchResult, set_showWorkoutSearchResult] =
    useState(false);
  const searchTermDebounced = useDebounce<string>(searchTerm, 500);

  const defaultValues = useMemo(() => {
    return {
      id: existingSession?.id ?? undefined,
      date: existingSession?.date ?? new Date(),
      workoutResults: existingSession?.workoutResults ?? [],
    };
  }, [existingSession]);

  const { getInfiniteWorkouts } = useWorkoutService();

  const {
    data: fetchedWorkouts,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = getInfiniteWorkouts({
    searchTerm: searchTermDebounced,
    enabled: searchTermDebounced.length > 2,
  });

  useEffect(() => {
    console.log("data", fetchedWorkouts);
  }, [fetchedWorkouts]);

  const workoutSearchResult = (
    <>
      {(fetchedWorkouts?.pages[0]?.workouts.length ?? 0) > 0 &&
        searchTerm.length !== 0 && (
          <div className="p-4 max-h-[180px] overflow-y-auto bg-base-100 rounded-xl">
            {fetchedWorkouts?.pages.map((workoutPage, pageIndex) => (
              <div className="flex flex-col gap-3" key={pageIndex}>
                {workoutPage.workouts.map((workout) => (
                  <div className="text-sm flex gap-5" key={workout.id}>
                    <div className="opacity-70">
                      {format(workout.createdAt, "dd/MM/yyyy")}
                    </div>

                    <div className="dropdown dropdown-hover overflow-hidden">
                      <label className="cursor-pointer overflow-ellipsis whitespace-nowrap ">
                        {workout.description}
                      </label>
                      <div className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                        {workout.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
    </>
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
  } = useForm<WorkoutSession>({
    defaultValues,
  });

  return (
    <Modal onClose={() => console.log("close modal")}>
      <>
        <h3 className="text-xl font-bold capitalize">{state} a session</h3>
        <form
          className="mt-5 flex flex-col gap-2  min-h-[400px]"
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
                    className="input w-full"
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

            <div className="form-control">
              <label className="label">
                <span className="label-text">Select workouts</span>
              </label>
              <div className="flex flex-col gap-2 relative">
                <input
                  className="input w-full pr-8"
                  onFocus={() => set_showWorkoutSearchResult(true)}
                  // onBlur={() => set_showWorkoutSearchResult(false)}
                  type="search"
                  placeholder={"search..."}
                  onChange={(e) => set_searchTerm(e.target.value)}
                />
                {isFetching && (
                  <div className="absolute top-0 right-1">
                    <Rings className="w-12" />
                  </div>
                )}
                {showWorkoutSearchResult && workoutSearchResult}
              </div>
            </div>
          </div>
          <div className="mt-3 flex justify-end gap-4 flex-wrap">
            <button
              className={`btn mt-2 ${isSubmitting ? "loading" : ""}`}
              type="submit"
            >
              {`${state} session`}
            </button>
          </div>
        </form>
      </>
    </Modal>
  );
}
