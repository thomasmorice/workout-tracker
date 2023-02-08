import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";

export const useWorkoutResultService = () => {
  const utils = trpc.useContext();
  const { data: sessionData } = useSession();

  const getWorkoutResultsByWorkoutId = (workoutId: number) =>
    trpc.workoutResult.getWorkoutResultsByWorkoutId.useQuery(
      {
        workoutId,
      },

      {
        enabled: !!workoutId && sessionData?.user !== undefined,
        refetchOnWindowFocus: false,
      }
    );

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
    getWorkoutResultsByWorkoutId,
    createOrEditMultipleWorkoutResult,
    deleteMultipleWorkoutResult,
  };
};
