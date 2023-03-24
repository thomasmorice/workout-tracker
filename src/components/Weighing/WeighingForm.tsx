import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { CreateWeighingInputSchema } from "../../types/app";
import { useToastStore } from "../../store/ToastStore";
import { useEventStore } from "../../store/EventStore";
import { useEffect, useState } from "react";
import { Rings } from "react-loading-icons";
import { inferRouterInputs } from "@trpc/server";
import { WeighingRouterType } from "../../server/trpc/router/weighing-router";
import { getRandomPreparingSessionllustration } from "../../utils/workout";
import DatePicker from "../DatePicker/DatePicker";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";

interface WeighingFormProps {
  // existingWeighing?: InferQueryOutput<"event.get-events">[number]["weighing"];
  onSuccess: () => void;
}

export default function WeighingForm({
  // existingWeighing,
  onSuccess,
}: WeighingFormProps) {
  const utils = trpc.useContext();
  const { data: sessionData } = useSession();
  const { addMessage, closeMessage } = useToastStore();
  const { eventBeingEdited, eventDate } = useEventStore();

  const {
    data: existingWeighing,
    isLoading,
    isFetching,
  } = trpc.weighing.getWeighingById.useQuery(
    {
      id: eventBeingEdited || -1,
    },
    {
      enabled: sessionData?.user !== undefined,
    }
  );
  const [illustration] = useState(getRandomPreparingSessionllustration());

  const handleCreateOrEdit: SubmitHandler<
    z.infer<typeof CreateWeighingInputSchema>
  > = async (weighing: z.infer<typeof CreateWeighingInputSchema>) => {
    try {
      await trpc.weighing.addOrEdit
        .useMutation({
          async onSuccess() {
            await utils.event.invalidate();
            await utils.weighing.invalidate();
          },
          onError(e) {
            throw e;
          },
        })
        .mutateAsync(weighing);
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

        <p className="pt-8 text-center text-sm font-light leading-loose">
          Track your weight and access those data from your dashboard. <br />
          <br />
          Tracking your weight can be beneficial for motivation and identifying
          patterns or trends in your weight loss journey. It is important to
          weigh yourself at the same time of day and under the same conditions
          each time, and to track your weight consistently according to your
          goals and preferences. Weight is just one aspect of overall health,
          and it is important to focus on other healthy habits as well.
        </p>

        <div className="form-control mt-6 w-full flex-row gap-4 self-center">
          <label className="label">
            <span className="label-text">Weight</span>
          </label>
          <label className="input-group w-fit">
            <input
              id="input-rep-max"
              step={0.1}
              className="input flex-1 bg-base-200 placeholder:opacity-50"
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

        <div className="mt-3 flex flex-wrap justify-center gap-4">
          <button
            className={`btn btn-primary btn-sm mt-2 rounded-full ${
              isSubmitting ? "loading" : ""
            }`}
            type="submit"
          >
            {`${existingWeighing ? "Edit" : "Add"} weighing`}
          </button>
        </div>
      </div>
    </form>
  );
}
