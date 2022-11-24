import { trpc } from "../utils/trpc";

export const useWorkoutResultService = () => {
  const utils = trpc.useContext();

  const createOrEditMultipleWorkoutResult =
    trpc.workoutResult.addOrEditMany.useMutation({
      async onSuccess() {
        await utils.event.invalidate();
      },
      onError(e: unknown) {
        console.log("error", e);
      },
    });

  const deleteMultipleWorkoutResult = trpc.workoutResult.deleteMany.useMutation(
    {
      async onSuccess() {
        await utils.workoutSession.getWorkoutSessionById.invalidate();
      },
      onError(e: unknown) {
        console.log("error", e);
        // throw e as TRPCError;
      },
    }
  );

  return {
    createOrEditMultipleWorkoutResult,
    deleteMultipleWorkoutResult,
  };
};
