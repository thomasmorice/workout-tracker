import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { CreateWorkoutInputSchema } from "../../../../types/app";
import { router, protectedProcedure } from "../../trpc";
import { WorkoutResultsSelect } from "../workout-result-router";
import {
  getAllWorkoutWithResults,
  getInfiniteWorkout,
  getInfiniteWorkoutWithResults,
} from "./get-infinite-workout";

export const WorkoutSelect = {
  id: true,
  name: true,
  difficulty: true,
  elementType: true,
  isDoableAtHome: true,
  affiliateDate: true,
  affiliateId: true,
  totalTime: true,
  description: true,
  workoutType: true,
  createdAt: true,
  updatedAt: true,
};

export const WorkoutExtras: Prisma.WorkoutSelect = {
  creator: true,
  _count: {
    select: { workoutResults: true },
  },
};

export const workoutRouter = router({
  getWorkoutById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(({ ctx, input }) => {
      const { id } = input;
      return ctx.prisma.workout.findFirstOrThrow({
        select: {
          ...WorkoutExtras,
          ...WorkoutSelect,
          benchmark: true,
          creator: true,
          _count: {
            select: {
              workoutResults: {
                where: {
                  workoutSession: {
                    athleteId: ctx.session.user.id,
                  },
                },
              },
            },
          },
          workoutResults: {
            select: {
              ...WorkoutResultsSelect,
              workoutSession: {
                select: {
                  id: true,
                  event: true,
                },
              },
            },
            orderBy: {
              workoutSession: {
                event: {
                  eventDate: "desc",
                },
              },
            },
          },
        },

        where: {
          AND: {
            id: id,
            // creatorId: ctx.session.user.id,
          },
        },
      });
    }),
  getInfiniteWorkout,
  getInfiniteWorkoutWithResults,
  getAllWorkoutWithResults,
  add: protectedProcedure
    .input(CreateWorkoutInputSchema)
    .mutation(({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Could not get user ID",
        });
      } else {
        return ctx.prisma.workout.create({
          data: {
            ...input,
            creatorId: ctx.session.user.id,
          },
          select: WorkoutSelect,
        });
      }
    }),
  edit: protectedProcedure
    .input(
      CreateWorkoutInputSchema.extend({
        id: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { id } = input;
      const workout = ctx.prisma.workout.update({
        where: { id },
        data: input,
        select: WorkoutSelect,
      });
      return workout;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const details = await ctx.prisma.workout.delete({ where: { id } });
      console.log("details", details);
      return {
        id,
      };
    }),
});

export type WorkoutRouterType = typeof workoutRouter;
