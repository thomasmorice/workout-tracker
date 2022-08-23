import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

interface WorkoutSessionsProps {
  dateFilter?: {
    lte: string;
    gte: string;
  };
}

export const useWorkoutSessionService = () => {
  const { data: sessionData } = useSession();
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

  const createWorkoutSession = trpc.useMutation("workout-session.add", {
    async onSuccess() {
      console.log("success!");
      // await utils.invalidateQueries(["workout.get-infinite-workouts"]);
    },
    onError(e: unknown) {
      console.log("error", e);
      // throw e as TRPCError;
    },
  });

  return { getWorkoutSessions, createWorkoutSession, getWorkoutSessionById };
};
