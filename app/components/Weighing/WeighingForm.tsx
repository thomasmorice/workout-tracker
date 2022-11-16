import { useForm, Controller, SubmitHandler } from "react-hook-form";
import DatePicker from "react-datepicker";
import { z } from "zod";
import { CreateWeighingInputSchema } from "../../types/app";
import { InferMutationInput, InferQueryOutput } from "../../types/trpc";
import { useWeighingService } from "../../services/useWeighingService";
import { useToastStore } from "../../store/ToastStore";
import { useEventStore } from "../../store/EventStore";
import { useEffect, useState } from "react";
import { Rings } from "react-loading-icons";

interface WeighingFormProps {
  // existingWeighing?: InferQueryOutput<"event.get-events">[number]["weighing"];
  onSuccess: () => void;
}

export default function WeighingForm({
  // existingWeighing,
  onSuccess,
}: WeighingFormProps) {
  const { addMessage, closeMessage } = useToastStore();
  const { getWeighingById, createOrEditWeighing } = useWeighingService();
  const { eventBeingEdited, eventDate } = useEventStore();

  const { data: existingWeighing, isLoading } = getWeighingById(
    eventBeingEdited || -1
  );

  const handleCreateOrEdit: SubmitHandler<
    z.infer<typeof CreateWeighingInputSchema>
  > = async (weighing: z.infer<typeof CreateWeighingInputSchema>) => {
    try {
      await createOrEditWeighing.mutateAsync(weighing);
      addMessage({
        type: "success",
        message: `Weighing ${
          eventBeingEdited ? "edited" : "added"
        } successfully`,
      });
    } catch {
      addMessage({
        message: "Error while adding the weight, probably missing the value",
        type: "error",
      });
    }
    onSuccess && onSuccess();
  };

  const [defaultValues, set_defaultValues] = useState({});

  useEffect(() => {
    set_defaultValues({
      id: existingWeighing?.id ?? undefined,
      eventId: existingWeighing?.event.id ?? undefined,
      date: existingWeighing?.event.eventDate ?? eventDate ?? new Date(),
      weight: existingWeighing?.weight ?? "",
    });
  }, [existingWeighing, eventDate]);

  const {
    handleSubmit,
    reset,
    register,
    control,
    formState: { isSubmitting, isDirty },
  } = useForm<InferMutationInput<"weighing.addOrEdit">>({
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  if (isLoading) {
    return <Rings className="h-14 w-14" />;
  }

  return (
    <form
      className="mt-5 flex flex-col pb-10"
      onSubmit={handleSubmit(handleCreateOrEdit)}
    >
      <div className="flex flex-col gap-3">
        <div className="form-control relative w-full flex-1">
          <label className="label">
            <span className="label-text">Weighing date</span>
          </label>
          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <DatePicker
                className="input w-full"
                // disabled={!editMode}
                showTimeInput
                placeholderText="Select date"
                onChange={(date: Date) => field.onChange(date)}
                selected={field.value}
                popperPlacement="bottom"
                dateFormat="MMMM d, h:mm aa"
              />
            )}
          />
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Weight</span>
          </label>
          <label className="input-group">
            <input
              id="input-rep-max"
              step={0.1}
              className="input max-w-[110px] flex-1 placeholder:opacity-50"
              {...register("weight", {
                setValueAs: (v) => {
                  return v === null || v === ""
                    ? null
                    : parseFloat(v as string);
                },
              })}
              placeholder="82"
              type={"number"}
            />
            <span>Kg</span>
          </label>
        </div>

        <div className="mt-3 flex flex-wrap justify-end gap-4">
          <button
            className={`btn mt-2 ${isSubmitting ? "loading" : ""}`}
            type="submit"
          >
            {`${existingWeighing ? "Edit" : "Add"} weighing`}
          </button>
        </div>
      </div>
    </form>
  );
}
