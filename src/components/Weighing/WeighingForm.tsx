import {
  useForm,
  Controller,
  SubmitHandler,
  useFieldArray,
} from "react-hook-form";
import { z } from "zod";
import { CreateWeighingInputSchema } from "../../types/app";
import { InferMutationInput, InferQueryOutput } from "../../types/trpc";

interface WeighingFormProps {
  existingWeighing?: InferQueryOutput<"weighing.getWeightings">[number];
  onSuccess: () => void;
}

export default function WeighingForm({
  existingWeighing,
  onSuccess,
}: WeighingFormProps) {
  const handleCreateOrEdit: SubmitHandler<
    z.infer<typeof CreateWeighingInputSchema>
  > = async (weighing: z.infer<typeof CreateWeighingInputSchema>) => {
    console.log("create or edit");
  };

  const defaultValues: z.infer<typeof CreateWeighingInputSchema> = {
    date: existingWeighing?.event.eventDate ?? new Date(),
    weight: existingWeighing?.weight ?? 0,
  };

  const {
    handleSubmit,
    reset,
    getValues,
    control,
    formState: { isSubmitting, isDirty },
  } = useForm<InferMutationInput<"weighing.addOrEdit">>({
    defaultValues,
  });

  return (
    <form
      className="mt-5 flex flex-col pb-10"
      onSubmit={handleSubmit(handleCreateOrEdit)}
    ></form>
  );
}
