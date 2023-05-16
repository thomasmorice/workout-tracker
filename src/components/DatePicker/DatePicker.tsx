import { format, parseISO, isToday, isTomorrow } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { UseControllerProps, useController } from "react-hook-form";
import { MdEdit } from "react-icons/md";

type DatePickerProps = {
  date?: Date;
};

export default function DatePicker(
  props: UseControllerProps<DatePickerProps & any>
) {
  const [showDateTimePicker, set_showDateTimePicker] = useState(false);
  const datetimePickerRef = useRef<HTMLInputElement>(null);
  const { field, fieldState } = useController(props);

  useEffect(() => {
    if (showDateTimePicker) {
      datetimePickerRef.current?.focus();
    }
  }, [showDateTimePicker]);

  return (
    <div className="flex w-fit items-center justify-center gap-2">
      {field.value && (
        <>
          {isToday(field.value) || isTomorrow(field.value) ? (
            <>
              {isToday(field.value) && "Today"}
              {isTomorrow(field.value) && "Tomorrow"}
              {format(field.value, ", p")}
            </>
          ) : (
            format(field.value, "EEEE, MMM dd, p")
          )}

          <button
            onClick={() => set_showDateTimePicker(true)}
            className="btn-ghost btn-sm btn-circle btn relative"
            type="button"
          >
            <MdEdit size={18} />
            <input
              className={`input-datetime absolute top-0 h-full w-5  opacity-0`}
              onChange={(e) => field.onChange(parseISO(e.target.value))}
              ref={datetimePickerRef}
              type="datetime-local"
            />
          </button>
        </>
      )}
    </div>
  );
}
