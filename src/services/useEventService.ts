import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

interface EventProps {
  dateFilter?: {
    lte: string;
    gte: string;
  };
}

export const useEventService = () => {
  const utils = trpc.useContext();
  const { data: sessionData } = useSession();

  // const createEvent = trpc.useMutation("event.add", {
  //   async onSuccess() {
  //     await utils.invalidateQueries(["workout.get-infinite-workouts"]);
  //   },
  //   onError(e: unknown) {
  //     throw e as TRPCError;
  //   },
  // });

  const getEvents = ({ dateFilter }: EventProps) => {
    return trpc.useQuery(
      [
        "event.get-events",
        {
          dateFilter,
        },
      ],
      {
        enabled: !!sessionData,
      }
    );
  };

  return {
    getEvents,
  };
};
