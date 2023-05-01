import { z } from "zod";
import { CreateWorkoutResultInputSchema } from "../../../types/app";
import { router, protectedProcedure } from "../trpc";

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

export const workoutResultRouter = router({
  getWorkoutResultsByWorkoutId: protectedProcedure
    .input(
      z.object({
        workoutId: z.number(),
        onlyFetchMine: z.boolean().default(true),
      })
    )
    .query(({ ctx, input }) => {
      const { workoutId } = input;
      const workoutResults = ctx.prisma.workoutResult.findMany({
        select: {
          ...WorkoutResultsSelect,
          workoutSession: {
            select: {
              id: true,
              event: true,
            },
          },
        },
        where: {
          workoutId: workoutId,
          ...(input.onlyFetchMine && {
            workoutSession: {
              athleteId: ctx.session.user.id,
            },
          }),
        },
        orderBy: {
          workoutSession: {
            event: {
              eventDate: "desc",
            },
          },
        },
      });
      return workoutResults;
    }),
  addOrEditMany: protectedProcedure
    .input(
      z.object({
        workoutResults: z.array(CreateWorkoutResultInputSchema),
        workoutSessionId: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.$transaction(
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
          return ctx.prisma.workoutResult.upsert({
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
    }),
  deleteMany: protectedProcedure
    .input(
      z.object({
        ids: z.array(z.number()),
      })
    )
    .mutation(({ ctx, input }) => {
      ctx.prisma.workoutResult.deleteMany({
        where: {
          id: {
            in: input.ids,
          },
        },
      });
      return input.ids;
    }),
});

export type WorkoutResultRouterType = typeof workoutResultRouter;
