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

  // const createWeighing = trpc.useMutation("weighing.add", {
  //   async onSuccess() {
  //     await utils.invalidateQueries(["workout.get-infinite-workouts"]);
  //   },
  //   onError(e: unknown) {
  //     throw e as TRPCError;
  //   },
  // });

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
    getWeightings,
  };
};
