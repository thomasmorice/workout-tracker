import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

export const useWorkoutResultService = () => {
  const { data: sessionData } = useSession();
  const utils = trpc.useContext();

  const createOrEditMultipleWorkoutResult = trpc.useMutation(
    "workout-result.addOrEditMany",
    {
      async onSuccess() {
        await utils.invalidateQueries(["workout-session.get-workout-sessions"]);
      },
      onError(e: unknown) {
        console.log("error", e);
        // throw e as TRPCError;
      },
    }
  );

  const deleteMultipleWorkoutResult = trpc.useMutation(
    "workout-result.deleteMany",
    {
      async onSuccess() {
        await utils.invalidateQueries([
          "workout-session.get-workout-session-by-id",
        ]);
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
