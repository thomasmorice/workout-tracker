import { TRPCError } from "@trpc/server";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { trpc } from "../utils/trpc";

interface InfiniteWorkoutsProps {
  showClassifiedWorkoutOnly?: boolean;
  searchTerm?: string;
  enabled?: boolean;
  ids?: {
    in?: number[];
    notIn?: number[];
  };
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
    enabled = true,
    ids,
  }: InfiniteWorkoutsProps) => {
    let filteredSearchTerm = searchTerm;
    if (searchTerm?.includes(">")) {
      if (searchTerm.includes("latest")) {
        filteredSearchTerm = "";
        // showLatest = true
      }
    }
    return trpc.useInfiniteQuery(
      [
        "workout.get-infinite-workouts",
        {
          elementTypes: [],
          classifiedOnly: showClassifiedWorkoutOnly,
          searchTerm: filteredSearchTerm,
          limit: 12,
          ids,
        },
      ],
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: !!sessionData && enabled,
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
