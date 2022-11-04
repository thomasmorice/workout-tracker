import { z } from "zod";
import { createProtectedRouter } from "./protected-router";
import { prisma } from "../db/client";
import { CreateWorkoutSessionInputSchema } from "../../types/app";

const WorkoutSessionSelect = {
  id: true,
  eventId: true,
  event: true,
};

export const workoutSessionRouter = createProtectedRouter()
  .query("count-all-sessions", {
    async resolve({ ctx }) {
      return await prisma.workoutSession.count({
        where: {
          athleteId: ctx.session.user.id,
        },
      });
    },
  })
  .query("get-workout-sessions", {
    input: z.object({
      dateFilter: z
        .object({
          lte: z.string().optional(),
          gte: z.string().optional(),
        })
        .nullish(),
    }),
    async resolve({ ctx, input }) {
      const { dateFilter } = input;
      return await prisma.workoutSession.findMany({
        select: {
          ...WorkoutSessionSelect,
          workoutResults: {
            orderBy: {
              order: "asc",
            },
            include: {
              workout: true,
            },
          },
        },
        where: {
          athleteId: ctx.session.user.id,
          ...(dateFilter && {
            event: {
              eventDate: {
                ...(dateFilter.lte && {
                  lte: dateFilter.lte,
                }),
                ...(dateFilter.gte && {
                  gte: dateFilter.gte,
                }),
              },
            },
          }),
        },
        orderBy: {
          event: {
            eventDate: "desc",
          },
        },
      });
    },
  })
  .query("get-workout-session-by-id", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input;
      const workoutSession = prisma.workoutSession.findFirst({
        select: {
          ...WorkoutSessionSelect,
          workoutResults: {
            orderBy: {
              order: "asc",
            },
            include: {
              workout: true,
            },
          },
        },
        where: {
          id: id,
        },
      });
      return workoutSession;
    },
  })
  .mutation("addOrEdit", {
    input: CreateWorkoutSessionInputSchema,
    async resolve({ ctx, input }) {
      return await prisma.workoutSession.upsert({
        select: {
          ...WorkoutSessionSelect,
          workoutResults: {
            orderBy: {
              order: "asc",
            },
            include: {
              workout: true,
            },
          },
        },
        create: {
          athlete: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          event: {
            create: {
              eventDate: input.date,
            },
          },
        },
        update: {
          event: {
            update: {
              eventDate: input.date,
            },
          },
        },
        where: {
          id: input.id ?? -1,
        },
      });
    },
  })
  .mutation("delete", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input;
      await prisma.workoutResult.deleteMany({
        where: {
          workoutSessionId: id,
        },
      });
      await prisma.workoutSession.delete({ where: { id: id } });
      return {
        id,
      };
    },
  });
