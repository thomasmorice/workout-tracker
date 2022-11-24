import { TRPCError } from "@trpc/server";
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

  const getEvents = ({ dateFilter }: EventProps) => {
    return trpc.event.getEvents.useQuery(
      {
        dateFilter,
      },
      { enabled: sessionData?.user !== undefined }
    );
  };

  const deleteEvent = trpc.event.delete.useMutation({
    async onSuccess() {
      await utils.event.getEvents.invalidate();
    },
    onError(e: unknown) {
      throw e as TRPCError;
    },
  });

  return {
    getEvents,
    deleteEvent,
  };
};
