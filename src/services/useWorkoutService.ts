import { WorkoutType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { useSession } from "next-auth/react";
import { useState } from "react";
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
  limit?: number;
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
    workoutTypes,
    searchTerm,
    onlyFetchMine,
    enabled = true,
    withResults = false,
    ids,
    orderResults,
    limit,
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
          workoutTypes,
          withResults,
          classifiedOnly: showClassifiedWorkoutOnly,
          searchTerm: filteredSearchTerm,
          limit: limit || 12,
          onlyFetchMine,
          ids,
          orderResults,
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
