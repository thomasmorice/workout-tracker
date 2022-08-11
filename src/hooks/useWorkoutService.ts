import { TRPCError } from "@trpc/server";
import { useState } from "react";
import { trpc } from "../utils/trpc";

export const useWorkoutService = () => {
  const [onError, set_onError] = useState<TRPCError>();
  const [onSuccess, set_onSuccess] = useState(false);

  const utils = trpc.useContext();

  const createWorkout = trpc.useMutation("workout.add", {
    async onSuccess() {
      await utils.invalidateQueries(["workout.get-infinite-workouts"]);
      set_onSuccess(true);
    },
    onError(e: unknown) {
      set_onError(e as TRPCError);
    },
  });

  const editWorkout = trpc.useMutation("workout.edit", {
    async onSuccess() {
      await utils.invalidateQueries(["workout.get-infinite-workouts"]);
      set_onSuccess(true);
    },
    onError(e: unknown) {
      set_onError(e as TRPCError);
    },
  });

  const deleteWorkout = trpc.useMutation("workout.delete", {
    async onSuccess() {
      await utils.invalidateQueries(["workout.get-infinite-workouts"]);
      set_onSuccess(true);
    },
  });

  return { createWorkout, editWorkout, deleteWorkout, onSuccess, onError };
};
