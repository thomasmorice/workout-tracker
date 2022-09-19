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
        enabled: !!sessionData,
      }
    );
  };

  // const getTwoLatestWeighing = () => {
  //   return trpc.useQuery(["weighing.get-two-latest"], {
  //     enabled: !!sessionData,
  //   });
  // };

  return {
    createOrEditWeighing,
    getWeighings,
  };
};
