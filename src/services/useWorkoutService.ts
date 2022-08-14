import { UseTRPCQueryOptions } from "@trpc/react";
import { TRPCError } from "@trpc/server";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { trpc } from "../utils/trpc";

interface InfiniteWorkoutsProps {
  showClassifiedWorkoutOnly?: boolean;
  searchTerm?: string;
}

export const useWorkoutService = () => {
  const utils = trpc.useContext();
  const { data: sessionData } = useSession();

  const createWorkout = trpc.useMutation("workout.add", {
    async onSuccess() {
      await utils.invalidateQueries(["workout.get-infinite-workouts"]);
    },
    onError(e: unknown) {
      throw e as TRPCError;
    },
  });

  const editWorkout = trpc.useMutation("workout.edit", {
    async onSuccess() {
      await utils.invalidateQueries(["workout.get-infinite-workouts"]);
    },
    onError(e: unknown) {
      throw e as TRPCError;
    },
  });

  const deleteWorkout = trpc.useMutation("workout.delete", {
    async onSuccess() {
      await utils.invalidateQueries(["workout.get-infinite-workouts"]);
    },
    onError(e: unknown) {
      throw e as TRPCError;
    },
  });

  const getInfiniteWorkouts = ({
    showClassifiedWorkoutOnly = true,
    searchTerm,
  }: InfiniteWorkoutsProps) => {
    return trpc.useInfiniteQuery(
      [
        "workout.get-infinite-workouts",
        {
          elementTypes: [],
          classifiedOnly: showClassifiedWorkoutOnly,
          searchTerm: searchTerm,
          limit: 12,
        },
      ],
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: !!sessionData,
      }
    );
  };

  const getWorkoutById = (id: unknown) => {
    const workoutId = parseInt(id as string);
    return trpc.useQuery(
      [
        "workout.get-workout-by-id",
        {
          id: workoutId,
        },
      ],
      { enabled: !!sessionData && !!id, refetchOnWindowFocus: false }
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
