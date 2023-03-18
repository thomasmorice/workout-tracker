import { WorkoutType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

interface InfiniteWorkoutsProps {
  showClassifiedWorkoutOnly?: boolean;
  withResults?: boolean;
  searchTerm?: string;
  enabled?: boolean;
  workoutTypes?: WorkoutType[];
  onlyFetchMine?: boolean;
  ids?: {
    in?: number[];
    notIn?: number[];
  };
  orderResults?: Object[];
  orderByMostlyDone?: boolean;
  limit?: number;
}

export const useWorkoutService = () => {
  const utils = trpc.useContext();
  const { data: sessionData } = useSession();

  const createWorkout = trpc.workout.add.useMutation({
    async onSuccess() {
      await utils.workout.getInfiniteWorkout.invalidate();
    },
    onError(e: unknown) {
      throw e as TRPCError;
    },
  });

  const editWorkout = trpc.workout.edit.useMutation({
    async onSuccess() {
      await utils.workout.getInfiniteWorkout.invalidate();
    },
    onError(e: unknown) {
      throw e as TRPCError;
    },
  });

  const deleteWorkout = trpc.workout.delete.useMutation({
    async onSuccess() {
      await utils.workout.getInfiniteWorkout.invalidate();
    },
    onError(e: unknown) {
      throw e as TRPCError;
    },
  });

  const getInfiniteWorkouts = ({
    showClassifiedWorkoutOnly = true,
    workoutTypes,
    searchTerm,
    onlyFetchMine,
    enabled = true,
    withResults = false,
    ids,
    orderResults,
    orderByMostlyDone,
    limit,
  }: InfiniteWorkoutsProps) => {
    let filteredSearchTerm = searchTerm;
    if (searchTerm?.includes(">")) {
      if (searchTerm.includes("latest")) {
        filteredSearchTerm = "";
        // showLatest = true
      }
    }

    return trpc.workout.getInfiniteWorkout.useInfiniteQuery(
      {
        workoutTypes,
        withResults,
        classifiedOnly: showClassifiedWorkoutOnly,
        searchTerm: filteredSearchTerm,
        limit: limit || 12,
        onlyFetchMine,
        ids,
        orderResults,
        orderByMostlyDone,
      },
      {
        // staleTime: 100000,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: enabled && sessionData?.user !== undefined,
      }
    );
  };

  const getWorkoutById = (id: number) => {
    return trpc.workout.getWorkoutById.useQuery(
      {
        id: id,
      },

      {
        enabled: !!id && sessionData?.user !== undefined,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      }
    );
  };

  return {
    createWorkout,
    editWorkout,
    deleteWorkout,
    getWorkoutById,
    getInfiniteWorkouts,
  };
};
