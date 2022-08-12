import { TRPCError } from "@trpc/server";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { trpc } from "../utils/trpc";

interface InfiniteWorkoutsProps {
  showClassifiedWorkoutOnly?: boolean;
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
  });

  const getInfiniteWorkouts = ({
    showClassifiedWorkoutOnly = true,
  }: InfiniteWorkoutsProps) => {
    return trpc.useInfiniteQuery(
      [
        "workout.get-infinite-workouts",
        {
          elementTypes: [],
          classifiedOnly: showClassifiedWorkoutOnly,
          limit: 12,
        },
      ],
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: !!sessionData,
      }
    );
  };

  return { createWorkout, editWorkout, deleteWorkout, getInfiniteWorkouts };
};
