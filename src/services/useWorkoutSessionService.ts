import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

interface WorkoutSessionsProps {
  dateFilter?: {
    lte?: string;
    gte?: string;
  };
}

export const useWorkoutSessionService = () => {
  const { data: sessionData } = useSession();
  const utils = trpc.useContext();

  const getWorkoutSessions = ({ dateFilter }: WorkoutSessionsProps) => {
    return trpc.useQuery(
      [
        "workout-session.get-workout-sessions",
        {
          dateFilter,
        },
      ],
      {
        enabled: !!sessionData,
      }
    );
  };

  const countAllSessions = () => {
    return trpc.useQuery(["workout-session.count-all-sessions"], {
      enabled: !!sessionData,
    });
  };

  const getWorkoutSessionById = (id: number) => {
    return trpc.useQuery(
      [
        "workout-session.get-workout-session-by-id",
        {
          id,
        },
      ],
      {
        enabled: !!sessionData,
      }
    );
  };

  const createOrEditWorkoutSession = trpc.useMutation(
    "workout-session.addOrEdit",
    {
      async onSuccess() {
        await utils.invalidateQueries(["event.get-events"]);
      },
      onError(e: unknown) {
        console.log("error", e);
        // throw e as TRPCError;
      },
    }
  );

  const deleteWorkoutSession = trpc.useMutation("workout-session.delete", {
    async onSuccess() {
      await utils.invalidateQueries(["event.get-events"]);
    },
    onError(e: unknown) {
      console.log("error", e);
      // throw e as TRPCError;
    },
  });

  return {
    countAllSessions,
    getWorkoutSessions,
    createOrEditWorkoutSession,
    getWorkoutSessionById,
    deleteWorkoutSession,
  };
};
