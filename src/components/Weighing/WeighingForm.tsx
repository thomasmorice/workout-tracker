import { useForm, Controller, SubmitHandler } from "react-hook-form";
import DatePicker from "react-datepicker";
import { z } from "zod";
import { CreateWeighingInputSchema } from "../../types/app";
import { InferMutationInput, InferQueryOutput } from "../../types/trpc";
import { useWeighingService } from "../../services/useWeightingService";
import { useToastStore } from "../../store/ToastStore";

interface WeighingFormProps {
  existingWeighing?: InferQueryOutput<"weighing.getWeightings">[number];
  onSuccess: () => void;
}

export default function WeighingForm({
  existingWeighing,
  onSuccess,
}: WeighingFormProps) {
  const { addMessage, closeMessage } = useToastStore();
  const { createOrEditWeighing } = useWeighingService();

  const handleCreateOrEdit: SubmitHandler<
    z.infer<typeof CreateWeighingInputSchema>
  > = async (weighing: z.infer<typeof CreateWeighingInputSchema>) => {
    await createOrEditWeighing.mutateAsync(weighing);
    addMessage({
      type: "success",
      message: `Weighing ${existingWeighing ? "edited" : "added"} successfully`,
    });
    onSuccess && onSuccess();
  };

  const defaultValues: z.infer<typeof CreateWeighingInputSchema> = {
    date: existingWeighing?.event.eventDate ?? new Date(),
    weight: existingWeighing?.weight ?? 0,
  };

  const {
    handleSubmit,
    reset,
    register,
    control,
    formState: { isSubmitting, isDirty },
  } = useForm<InferMutationInput<"weighing.addOrEdit">>({
    defaultValues,
  });

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
                className="input w-full bg-base-200"
                // disabled={!editMode}
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
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Weight</span>
          </label>
          <label className="input-group">
            <input
              id="input-rep-max"
              step={0.1}
              className="input max-w-[110px] flex-1 placeholder:opacity-50  bg-base-200"
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

        <div className="mt-3 flex justify-end gap-4 flex-wrap">
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
