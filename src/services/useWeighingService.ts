import { TRPCError } from "@trpc/server";
import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

interface WeighingProps {
  dateFilter?: {
    lte: string;
    gte: string;
  };
  take: number;
}

export const useWeighingService = () => {
  const utils = trpc.useContext();
  const { data: sessionData } = useSession();

  const createOrEditWeighing = trpc.weighing.addOrEdit.useMutation({
    async onSuccess() {
      await utils.event.invalidate();
      await utils.weighing.invalidate();
    },
    onError(e: unknown) {
      throw e as TRPCError;
    },
  });

  const getWeighings = ({ dateFilter, take }: WeighingProps) => {
    return trpc.weighing.getWeighings.useQuery(
      {
        dateFilter,
        take,
      },
      {
        enabled: sessionData?.user !== undefined,
      }
    );
  };

  const getWeighingById = (id: number) => {
    return trpc.weighing.getWeighingById.useQuery(
      {
        id,
      },
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
