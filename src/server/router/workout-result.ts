import { Difficulty, ElementType, Prisma, WorkoutType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../db/client";
import { createProtectedRouter } from "./protected-router";
import { CreateWorkoutInputSchema } from "./workout";

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

export const WorkoutResultCreateInput = z.object({
  id: z.number().optional(),
  workoutId: z.number(),
  workoutSessionId: z.number().optional(),
  description: z.string().nullish(),
  rating: z.number().nullish(),
  shouldRecommendWorkoutAgain: z.boolean().optional(),
  isRx: z.boolean().nullish(),
  totalReps: z.number().nullish(),
  weight: z.number().nullish(),
  time: z.number().nullish(),
  workout: CreateWorkoutInputSchema.extend({
    id: z.number(), // Yep, id is mandatory in workout result, you can't add a result to a non existing workout..
  }),
});

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

export const workoutResultRouter = createProtectedRouter()
  .query("get-workout-results-by-workout-id", {
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
  })
  .mutation("addOrEditMany", {
    input: z.object({
      workoutResults: z.array(WorkoutResultCreateInput),
      workoutSessionId: z.number(),
    }),
    async resolve({ ctx, input }) {
      const workoutResults = await prisma.$transaction(
        input.workoutResults.map((result) => {
          const pickedResult = {
            description: result.description,
            isRx: result.isRx,
            rating: result.rating,
            time: result.time,
            shouldRecommendWorkoutAgain: result.shouldRecommendWorkoutAgain,
            totalReps: result.totalReps,
            id: result.id,
            workoutId: result.workout.id,
            workoutSessionId: input.workoutSessionId,
          };
          return prisma.workoutResult.upsert({
            create: {
              ...pickedResult,
            },
            update: {
              ...pickedResult,
            },
            where: {
              id: result.id ?? -1,
            },
          });
        })
      );
      return workoutResults;
    },
  });
