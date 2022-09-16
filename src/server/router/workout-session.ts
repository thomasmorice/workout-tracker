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
  .query("get-workout-sessions", {
    input: z.object({
      dateFilter: z
        .object({
          lte: z.string(),
          gte: z.string(),
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
                lte: dateFilter.lte,
                gte: dateFilter.gte,
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
      let newOrUpdatedEvent = await prisma.event.upsert({
        create: {
          eventDate: input.date,
        },
        update: {
          eventDate: input.date,
        },
        where: {
          id: input.eventId ?? -1,
        },
      });

      let workoutSession = await prisma.workoutSession.upsert({
        create: {
          eventId: newOrUpdatedEvent.id,
          athleteId: ctx.session.user.id,
        },
        update: {
          eventId: input.eventId,
        },
        where: {
          id: input.id ?? -1,
        },
        // select: WorkoutSessionSelect,
      });

      return workoutSession;
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
