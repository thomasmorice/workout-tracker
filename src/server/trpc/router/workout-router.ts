import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  CreateWorkoutInputSchema,
  GetAllWorkoutsInputSchema,
} from "../../../types/app";
import { router, protectedProcedure } from "../trpc";
import { WorkoutResultsSelect } from "./workout-result-router";

export const WorkoutSelect = {
  id: true,
  name: true,
  difficulty: true,
  elementType: true,
  isDoableAtHome: true,
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

const SelectWorkout = {
  ...WorkoutExtras,
  ...WorkoutSelect,
  workoutResults: {
    select: {
      weight: true,

      workoutSession: {
        select: {
          event: true,
        },
      },
    },
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
  getInfiniteWorkout: protectedProcedure
    .input(GetAllWorkoutsInputSchema)
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 20;
      const { cursor } = input;
      const {
        elementTypes,
        workoutTypes,
        onlyFetchMine,
        classifiedOnly,
        searchTerm,
        ids,
        orderByMostlyDone,
        orderResults,
      } = input;
      const where: Prisma.WorkoutWhereInput = {
        ...(elementTypes?.length && {
          elementType: {
            in: elementTypes,
          },
        }),
        ...(workoutTypes?.length && {
          workoutType: {
            in: workoutTypes,
          },
        }),
        ...(classifiedOnly && {
          NOT: {
            elementType: "UNCLASSIFIED",
          },
        }),
        ...(searchTerm && {
          OR: [
            {
              description: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
            {
              name: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
            {
              ...(parseInt(searchTerm) && {
                id: {
                  equals: parseInt(searchTerm),
                },
              }),
            },
          ],
        }),
        ...(ids &&
          ids.notIn && {
            id: {
              notIn: ids.notIn,
            },
          }),
        ...(ids &&
          ids.in && {
            id: {
              in: ids.in,
            },
          }),
        AND: {
          OR: [
            {
              creatorId: ctx.session.user.id,
            },
            {
              AND: [
                {
                  ...(!onlyFetchMine && {
                    creator: {
                      following: {
                        some: {
                          friendUserId: ctx.session.user.id,
                        },
                      },
                    },
                  }),
                  // elementType: "UNCLASSIFIED",
                },
              ],
            },
          ],
        },
      };
      const workouts = await ctx.prisma.workout.findMany({
        take: limit + 1,
        select: {
          ...SelectWorkout,
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
        },
        where: {
          ...where,
        },
        cursor: cursor ? { id: cursor } : undefined,
        ...(orderByMostlyDone && {
          orderBy: {
            workoutResults: {
              _count: "desc",
            },
          },
        }),
        ...(!orderByMostlyDone && {
          orderBy: [
            {
              createdAt: "desc",
            },
            {
              id: "desc",
            },
          ],
        }),
      });
      let nextCursor: typeof cursor | null = null;
      if (workouts.length > limit) {
        const nextItem = workouts.pop();
        nextCursor = nextItem?.id;
      }
      return {
        workouts,
        nextCursor,
      };
    }),
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
    .mutation(({ ctx, input }) => {
      const { id } = input;
      ctx.prisma.workout.delete({ where: { id } });
      return {
        id,
      };
    }),
});

export type WorkoutRouterType = typeof workoutRouter;
