import { format, parseISO } from "date-fns";
import { ReactElement, useEffect, useRef, useState } from "react";
import { MdArrowBackIosNew, MdEdit } from "react-icons/md";
import { getRandomPreparingSessionllustration } from "../../utils/workout";
import { date } from "zod";
import { Controller, useForm } from "react-hook-form";
import { inferRouterInputs } from "@trpc/server";
import { WorkoutSessionRouterType } from "../../server/trpc/router/workout-session-router";
import { WorkoutResultInputsWithWorkout } from "../../types/app";

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
    <div className="h-screen">
      <div
        style={{
          backgroundImage: `url(/workout-item/${illustration}.png)`,
        }}
        className="absolute top-0 left-0 h-56 w-full bg-cover bg-center opacity-50"
      ></div>

      <div
        onClick={onClose}
        className="btn-ghost btn btn-circle absolute top-4 left-2"
      >
        <MdArrowBackIosNew size={26} />
      </div>
      <div className="relative mt-8">
        <div className="flex items-center justify-center gap-1 font-semibold ">
          {format(getValues("date"), "EEEE, MMM dd, p")}
          <button
            onClick={() => set_showDateTimePicker(true)}
            className="btn-ghost btn btn-sm btn-circle relative"
            type="button"
          >
            <MdEdit size={18} />
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <input
                  className={`input-datetime absolute top-0 left-0 h-full w-full opacity-0`}
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

          {/* {showDateTimePicker && (
            <div className="absolute top-3">
              {/* <StaticDateTimePicker
                value={new Date()}
                onChange={(newValue) => {
                  // set_showDateTimePicker(false);
                }}
                
                slots={{

                }}
                renderInput={(params) => <TextField {...params} />}
              /> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}
