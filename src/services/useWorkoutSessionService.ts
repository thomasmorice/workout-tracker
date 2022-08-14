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

  return { getWorkoutSessions };
};
