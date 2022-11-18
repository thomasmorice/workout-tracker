import { TRPCError } from "@trpc/server";
import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

interface WeightingProps {
  dateFilter?: {
    lte: string;
    gte: string;
  };
  take: number;
}

export const useWeighingService = () => {
  const utils = trpc.useContext();
  const { data: sessionData } = useSession();

  const createOrEditWeighing = trpc.useMutation("weighing.addOrEdit", {
    async onSuccess() {
      await utils.invalidateQueries(["event.get-events"]);
      await utils.invalidateQueries(["weighing.getWeightings"]);
    },
    onError(e: unknown) {
      throw e as TRPCError;
    },
  });

  const getWeighings = ({ dateFilter, take }: WeightingProps) => {
    return trpc.useQuery(
      [
        "weighing.getWeightings",
        {
          dateFilter,
          take,
        },
      ],
      {
        enabled: sessionData?.user !== undefined,
      }
    );
  };

  const getWeighingById = (id: number) => {
    return trpc.useQuery(
      [
        "weighing.getWeighingById",
        {
          id,
        },
      ],
      {
        enabled: sessionData?.user !== undefined && id !== -1,
      }
    );
  };

  return {
    createOrEditWeighing,
    getWeighings,
    getWeighingById,
  };
};
