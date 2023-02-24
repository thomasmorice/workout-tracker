import { format, parseISO } from "date-fns";
import { ReactElement, useEffect, useRef, useState } from "react";
import { MdArrowBackIosNew, MdEdit, MdModelTraining } from "react-icons/md";
import { getRandomPreparingSessionllustration } from "../../utils/workout";
import { date } from "zod";
import { Controller, useForm } from "react-hook-form";
import { inferRouterInputs } from "@trpc/server";
import { WorkoutSessionRouterType } from "../../server/trpc/router/workout-session-router";
import { WorkoutResultInputsWithWorkout } from "../../types/app";
import { useRouter } from "next/router";
import { useWorkoutStore } from "../../store/WorkoutStore";

interface WorkoutSessionFormProps {
  onClose: () => void;
}

export default function WorkoutSessionForm({
  onClose,
}: WorkoutSessionFormProps) {
  const [illustration] = useState(getRandomPreparingSessionllustration());
  const datetimePickerRef = useRef<HTMLInputElement>(null);
  const [showDateTimePicker, set_showDateTimePicker] = useState(false);
  const [defaultValues, set_defaultValues] = useState({
    date: new Date(),
  });
  const { setWorkoutSelectionMode } = useWorkoutStore();
  const router = useRouter();

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

  watch("date");

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
        onClick={onClose}
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
                  onChange={
                    (e) => field.onChange(parseISO(e.target.value))
                    // console.log("Date", parseISO(e.target.value))
                  }
                  ref={datetimePickerRef}
                  type="datetime-local"
                />
              )}
            />
          </button>
        </div>

        <button
          type="button"
          className="btn-primary btn-sm mt-7 self-center rounded-full text-xs font-semibold uppercase"
          onClick={() => {
            router.push("workouts");
            setWorkoutSelectionMode(true);
            onClose();
          }}
        >
          Add a workout
        </button>

        <p className="pt-14 text-center text-sm font-light leading-loose">
          Don&apos;t have a workout in mind? No problem! Use our &quot;Suggest a
          session&quot; feature that provides a pre-made workout session for
          you. Once you&apos;re done with your workout, log your results and
          watch your progress soar! Our app is designed to make working out fun
          and engaging. So, let&apos;s get those endorphins flowing, stay
          consistent, and crush those fitness goals together!
        </p>

        <button
          type="button"
          className="btn-sm btn mt-7 flex items-center gap-2 self-center rounded-full text-xs font-semibold uppercase"
        >
          <MdModelTraining size={19} />
          Suggest a session
        </button>
      </div>
    </div>
  );
}
