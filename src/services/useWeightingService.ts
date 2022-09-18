import { TRPCError } from "@trpc/server";
import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

interface WeightingProps {
  dateFilter?: {
    lte: string;
    gte: string;
  };
}

export const useWeighingService = () => {
  const utils = trpc.useContext();
  const { data: sessionData } = useSession();

  const createOrEditWeighing = trpc.useMutation("weighing.addOrEdit", {
    async onSuccess() {
      await utils.invalidateQueries(["event.get-events"]);
    },
    onError(e: unknown) {
      throw e as TRPCError;
    },
  });

  const getWeightings = ({ dateFilter }: WeightingProps) => {
    return trpc.useQuery(
      [
        "weighing.getWeightings",
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
    createOrEditWeighing,
    getWeightings,
  };
};
