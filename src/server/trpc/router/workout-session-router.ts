import { z } from "zod";
import { CreateWorkoutSessionInputSchema } from "../../../types/app";
import { router, protectedProcedure } from "../trpc";
import { WorkoutExtras, WorkoutSelect } from "./WorkoutRouter/workout-router";

const WorkoutSessionSelect = {
  id: true,
  eventId: true,
  event: true,
};

export const workoutSessionRouter = router({
  countAllSessions: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.workoutSession.count({
      where: {
        athleteId: ctx.session.user.id,
      },
    });
  }),
  getSessionsForInsights: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.workoutSession.findMany({
      select: {
        event: {
          select: {
            eventDate: true,
          },
        },
      },
      where: {
        athleteId: ctx.session.user.id,
      },
      orderBy: {
        event: {
          eventDate: "asc",
        },
      },
    });
  }),
  getWorkoutSessions: protectedProcedure
    .input(
      z.object({
        dateFilter: z
          .object({
            lte: z.string().optional(),
            gte: z.string().optional(),
          })
          .nullish(),
      })
    )
    .query(({ ctx, input }) => {
      const { dateFilter } = input;
      return ctx.prisma.workoutSession.findMany({
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
    }),
  getWorkoutSessionById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(({ ctx, input }) => {
      const { id } = input;
      return ctx.prisma.workoutSession.findFirstOrThrow({
        select: {
          ...WorkoutSessionSelect,
          workoutResults: {
            orderBy: {
              order: "asc",
            },
            include: {
              workout: {
                select: {
                  ...WorkoutExtras,
                  ...WorkoutSelect,
                },
              },
            },
          },
        },
        where: {
          id: id,
        },
      });
    }),
  addOrEdit: protectedProcedure
    .input(CreateWorkoutSessionInputSchema)
    .mutation(({ input, ctx }) => {
      return ctx.prisma.workoutSession.upsert({
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
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      const { id } = input;
      ctx.prisma.workoutResult.deleteMany({
        where: {
          workoutSessionId: id,
        },
      });
      ctx.prisma.workoutSession.delete({ where: { id: id } });
      return {
        id,
      };
    }),
});

export type WorkoutSessionRouterType = typeof workoutSessionRouter;
