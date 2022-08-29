import { z } from "zod";
import { createProtectedRouter } from "./protected-router";
import { prisma } from "../db/client";

import { WorkoutResultCreateInput } from "./workout-result";

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
  id: z.number().optional(), // if not set: create else : edit
  date: z.date(),
  workoutResults: z.array(WorkoutResultCreateInput),
  // workoutResults: z.array(
  //   z.object({
  //     workoutId: z.number(),
  //     description: z.string().nullish(),
  //     rating: z.number().nullish(),
  //     shouldRecommendWorkoutAgain: z.boolean().optional(),
  //     isRx: z.boolean().nullish(),
  //     totalReps: z.number().nullish(),
  //     time: z.number().nullish(),

  //     workout: z.object({
  //       id: z.number(),
  //       name: z.string().nullish(),
  //       difficulty: z.nativeEnum(Difficulty).nullable(),
  //       workoutType: z.nativeEnum(WorkoutType).nullish(),
  //       description: z.string(),
  //     }),
  //   })
  // ),
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
  .query("get-workout-session-by-id", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input;
      const workoutSession = prisma.workoutSession.findFirst({
        select: {
          ...WorkoutSessionSelect,
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
          // workoutResults: {
          //   createMany: {
          //     data: [...input.workoutResults].map(
          //       ({ workout, ...rest }) => rest
          //     ),
          //   },
          // },
          athleteId: ctx.session.user.id,
        },
        update: {
          date: input.date,
          // workoutResults: {
          //   createMany: {
          //     data: [...input.workoutResults].map(
          //       ({ workout, ...rest }) => rest
          //     ),
          //   },
          // },
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
