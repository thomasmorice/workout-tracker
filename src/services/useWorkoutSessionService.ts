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
    return trpc.workoutSession.getWorkoutSessions.useQuery(
      {
        dateFilter,
      },

      {
        enabled: sessionData?.user !== undefined,
      }
    );
  };

  const countAllSessions = () => {
    return trpc.workoutSession.countAllSessions.useQuery(undefined, {
      enabled: sessionData?.user !== undefined,
    });
  };

  const getSessionForInsights = () => {
    return trpc.workoutSession.getSessionsForInsights.useQuery(undefined, {
      enabled: sessionData?.user !== undefined,
    });
  };

  const getWorkoutSessionById = (id: number) => {
    return trpc.workoutSession.getWorkoutSessionById.useQuery(
      {
        id,
      },
      {
        enabled: sessionData?.user !== undefined && id !== -1,
        refetchOnWindowFocus: false,
      }
    );
  };

  const createOrEditWorkoutSession = trpc.workoutSession.addOrEdit.useMutation({
    async onSuccess() {
      await utils.event.getEvents.invalidate();
    },
    onError(e: unknown) {
      console.log("error", e);
      // throw e as TRPCError;
    },
  });

  const deleteWorkoutSession = trpc.workoutSession.delete.useMutation({
    async onSuccess() {
      await utils.event.getEvents.invalidate();
    },
    onError(e: unknown) {
      console.log("error", e);
      // throw e as TRPCError;
    },
  });

  return {
    countAllSessions,
    getSessionForInsights,
    getWorkoutSessions,
    createOrEditWorkoutSession,
    getWorkoutSessionById,
    deleteWorkoutSession,
  };
};
