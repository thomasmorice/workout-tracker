import { number, string, z } from "zod";
import { createProtectedRouter } from "./protected-router";
import { prisma } from "../db/client";
import { Prisma, WorkoutResult } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { Query } from "react-query";

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

export const CreateWorkoutSessionInputSchema = z.object({
  date: z.date(),
});

async function getWorkoutSessionForType() {
  const workoutSession = await prisma.workoutSession.findFirstOrThrow({
    select: {
      ...WorkoutSessionSelect,
    },
  });
  return workoutSession;
}

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
export type WorkoutSession = ThenArg<
  ReturnType<typeof getWorkoutSessionForType>
>;

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
  .mutation("add", {
    input: CreateWorkoutSessionInputSchema,
    async resolve({ ctx, input }) {
      if (!ctx.session?.user?.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Could not get user ID",
        });
      } else {
        const workoutSession = await prisma.workoutSession.create({
          data: {
            ...input,
          },
          select: WorkoutSessionSelect,
        });
        return workoutSession;
      }
    },
  });
