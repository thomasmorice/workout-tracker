import {
  Difficulty,
  ElementType,
  Prisma,
  Workout,
  WorkoutType,
} from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { CreateWorkoutInputSchema } from "../../types/app";
import { prisma } from "../db/client";
import { createProtectedRouter } from "./protected-router";
import { WorkoutResultsSelect } from "./workout-result";

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

export const WorkoutExtras = {
  creator: true,
  _count: {
    select: { workoutResults: true },
  },
};

export const workoutRouter = createProtectedRouter()
  .query("get-workout-by-id", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input;
      const workout = await prisma.workout.findFirst({
        select: {
          ...WorkoutExtras,
          ...WorkoutSelect,
          ...{
            workoutResults: {
              select: {
                ...WorkoutResultsSelect,
                workoutSession: {
                  select: {
                    date: true,
                  },
                },
              },
            },
          },
        },
        where: {
          AND: {
            id: id,
            creatorId: ctx.session.user.id,
          },
        },
      });
      return workout;
    },
  })
  .query("get-infinite-workouts", {
    input: z.object({
      elementTypes: z.nativeEnum(ElementType).array().nullish(),
      classifiedOnly: z.boolean().nullish(),
      searchTerm: z.string().nullish(),
      ids: z
        .object({
          in: z.array(z.number()).nullish(),
          notIn: z.array(z.number()).nullish(),
        })
        .nullish(),
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
    }),
    async resolve({ ctx, input }) {
      const limit = input.limit ?? 20;
      const { cursor } = input;
      const { elementTypes, classifiedOnly, searchTerm, ids } = input;

      const where: Prisma.WorkoutWhereInput = {
        ...(elementTypes &&
          elementTypes.length > 0 && {
            elementType: {
              in: elementTypes,
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
          creatorId: ctx.session.user.id,
        },
      };

      console.log("where", where);

      const workouts = await prisma.workout.findMany({
        take: limit + 1,
        select: {
          ...WorkoutExtras,
          ...WorkoutSelect,
        },

        where: where,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [
          {
            createdAt: "desc",
          },
          {
            id: "desc",
          },
        ],
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
    },
  })
  .mutation("add", {
    input: CreateWorkoutInputSchema,
    async resolve({ ctx, input }) {
      if (!ctx.session?.user?.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Could not get user ID",
        });
      } else {
        const workout = await prisma.workout.create({
          data: {
            ...input,
            creatorId: ctx.session.user.id,
          },
          select: WorkoutSelect,
        });
        return workout;
      }
    },
  })
  .mutation("edit", {
    input: CreateWorkoutInputSchema.extend({
      id: z.number(),
    }),

    async resolve({ input }) {
      const { id } = input;
      const workout = await prisma.workout.update({
        where: { id },
        data: input,
        select: WorkoutSelect,
      });
      return workout;
    },
  })
  .mutation("delete", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      const { id } = input;
      await prisma.workout.delete({ where: { id } });
      return {
        id,
      };
    },
  });
