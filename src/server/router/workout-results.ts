import { Difficulty, ElementType, Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../db/client";
import { createProtectedRouter } from "./protected-router";

export const WorkoutResultsSelect = {
  id: true,
  workout: true,
  isRx: true,
  totalReps: true,
  time: true,
  rating: true,
  description: true,
  shouldRecommendWorkoutAgain: true,
  createdAt: true,
  workoutSession: true,
};

export const WorkoutResultsExtras = {
  creator: true,
  _count: {
    select: { workoutResults: true },
  },
};

type ManyCreateInput = Prisma.WorkoutResultCreateManyInput;

async function getWorkoutForType() {
  const workouts = await prisma.workoutResult.findFirstOrThrow({
    select: {
      ...WorkoutResultsSelect,
      ...WorkoutResultsExtras,
    },
  });

  return workouts;
}

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
export type WorkoutResultsWithExtras = ThenArg<
  ReturnType<typeof getWorkoutForType>
>;

export const workoutResultRouter = createProtectedRouter().query(
  "get-workout-results-by-workout-id",
  {
    input: z.object({
      workoutId: z.number(),
    }),
    async resolve({ ctx, input }) {
      const { workoutId } = input;
      const workoutResults = await prisma.workoutResult.findMany({
        select: {
          ...WorkoutResultsSelect,
        },
        where: {
          workoutId: workoutId,
        },
      });
      return workoutResults;
    },
  }
);
// .query(
//   "add-workout-results", {
//     input,

//     async resolve({ ctx, input }) {
//       // const { workoutResults } = input;
//       const workoutResults = await prisma.workoutResult.createMany({
//         data: []
//         // select: {
//         //   ...WorkoutResultsSelect,
//         // },
//       });
//       return workoutResults;
//     },
//   }
// );
