import { number, string, z } from "zod";
import { createProtectedRouter } from "./protected-router";
import { prisma } from "../db/client";
import { Prisma, WorkoutResult } from "@prisma/client";

export const WorkoutSessionSelect = {
  id: true,
  date: true,
  createdAt: true,
  workoutResults: {
    include: {
      workout: true,
    },
  },
};

export const workoutSessionRouter = createProtectedRouter().query(
  "get-workout-sessions",
  {
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
      console.log("datefilter", dateFilter);
      const workoutSessions = await prisma.workoutSession.findMany({
        select: {
          ...WorkoutSessionSelect,
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
  }
);
