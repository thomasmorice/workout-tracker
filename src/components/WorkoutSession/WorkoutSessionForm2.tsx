import { format, parseISO } from "date-fns";
import { ReactElement, useEffect, useRef, useState } from "react";
import { MdEdit } from "react-icons/md";
import { getRandomPreparingSessionllustration } from "../../utils/workout";
import { date } from "zod";
import { Controller, useForm } from "react-hook-form";
import { inferRouterInputs } from "@trpc/server";
import { WorkoutSessionRouterType } from "../../server/trpc/router/workout-session-router";
import { WorkoutResultInputsWithWorkout } from "../../types/app";

interface WorkoutSessionFormProps {
  onSuccess?: () => void;
}

export default function WorkoutSessionForm({
  onSuccess,
}: WorkoutSessionFormProps) {
  const [illustration] = useState(getRandomPreparingSessionllustration());
  const datetimePickerRef = useRef<HTMLInputElement>(null);
  const [defaultValues, set_defaultValues] = useState({
    date: new Date(),
  });

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
    <div className="min-h-[520px]">
      <div
        style={{
          backgroundImage: `url(/workout-item/${illustration}.png)`,
        }}
        className="absolute top-0 left-0 h-56 w-full bg-cover bg-center opacity-50"
      ></div>

      <div className="relative">
        <div className="flex items-center justify-center gap-1 font-semibold ">
          {format(getValues("date"), "EEEE, MMM dd, p")}
          <button
            onClick={() => datetimePickerRef.current?.showPicker()}
            className="btn-ghost btn btn-sm btn-circle"
            type="button"
          >
            <MdEdit size={18} />
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <input
                  className="hidden"
                  step={1800}
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
