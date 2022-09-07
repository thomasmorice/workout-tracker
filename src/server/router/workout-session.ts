import { z } from "zod";
import { createProtectedRouter } from "./protected-router";
import { prisma } from "../db/client";
import { CreateWorkoutResultInputSchema } from "../../types/app";

const WorkoutSessionSelect = {
  id: true,
  date: true,
  createdAt: true,
};

export const CreateWorkoutSessionInputSchema = z.object({
  id: z.number().optional(), // if not set: create else : edit
  date: z.date(),
  workoutResults: z.array(CreateWorkoutResultInputSchema),
});

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
      const workoutSessions = await prisma.workoutSession.findMany({
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
            date: {
              lte: dateFilter.lte,
              gte: dateFilter.gte,
            },
          }),
        },
        orderBy: {
          date: "desc",
        },
      });
      return workoutSessions;
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
      console.log("INPUT", input);
      let workoutSession = await prisma.workoutSession.upsert({
        create: {
          date: input.date,
          athleteId: ctx.session.user.id,
        },
        update: {
          date: input.date,
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
