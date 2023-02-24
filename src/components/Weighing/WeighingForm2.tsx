import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { CreateWeighingInputSchema } from "../../types/app";
import { useWeighingService } from "../../services/useWeighingService";
import { useToastStore } from "../../store/ToastStore";
import { useEventStore } from "../../store/EventStore";
import { useEffect, useRef, useState } from "react";
import { Rings } from "react-loading-icons";
import { inferRouterInputs } from "@trpc/server";
import { WeighingRouterType } from "../../server/trpc/router/weighing-router";
import { getRandomPreparingSessionllustration } from "../../utils/workout";
import { MdArrowBackIosNew, MdEdit } from "react-icons/md";
import { format, parseISO } from "date-fns";
import DatePicker from "../DatePicker/DatePicker";

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

  const {
    data: existingWeighing,
    isLoading,
    isFetching,
  } = getWeighingById(eventBeingEdited || -1);
  const [illustration] = useState(getRandomPreparingSessionllustration());

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
    getValues,
    watch,
    formState: { isSubmitting, isDirty },
  } = useForm<inferRouterInputs<WeighingRouterType>["addOrEdit"]>({
    defaultValues,
  });

  useEffect(() => {
    console.log("date", getValues("date"));
  }, [getValues("date")]);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  if (isLoading && isFetching) {
    return <Rings className="h-14 w-14" />;
  }
  watch("date");

  return (
    <form onSubmit={handleSubmit(handleCreateOrEdit)}>
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

      <div className="relative flex flex-col gap-3">
        <DatePicker name="date" control={control} />

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Weight</span>
          </label>
          <label className="input-group">
            <input
              id="input-rep-max"
              step={0.1}
              className="input max-w-[110px] flex-1 bg-base-200 placeholder:opacity-50"
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
