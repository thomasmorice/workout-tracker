import { z } from "zod";
import { CreateWorkoutResultInputSchema } from "../../types/app";
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
  weight: true,
};

export const WorkoutResultsExtras = {
  creator: true,
  _count: {
    select: { workoutResults: true },
  },
};

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
      workoutResults: z.array(CreateWorkoutResultInputSchema),
      workoutSessionId: z.number(),
    }),
    async resolve({ ctx, input }) {
      const workoutResults = await prisma.$transaction(
        input.workoutResults.map((result, index) => {
          const pickedResult = {
            description: result.description,
            isRx: result.isRx,
            rating: result.rating,
            time: result.time,
            shouldRecommendWorkoutAgain: result.shouldRecommendWorkoutAgain,
            totalReps: result.totalReps,
            weight: result.weight,
            id: result.id,
            order: index + 1,
            workoutId: result.workout.id,
            workoutSessionId: input.workoutSessionId,
          };
          return prisma.workoutResult.upsert({
            include: {
              workout: true,
            },
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
  })
  .mutation("deleteMany", {
    input: z.object({
      ids: z.array(z.number()),
    }),
    async resolve({ ctx, input }) {
      await prisma.workoutResult.deleteMany({
        where: {
          id: {
            in: input.ids,
          },
        },
      });
      return input.ids;
    },
  });
