import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

const EventSelect = {
  id: true,
  eventDate: true,
  createdAt: true,
};

export const eventRouter = router({
  getEvents: protectedProcedure
    .input(
      z.object({
        dateFilter: z
          .object({
            lte: z.string(),
            gte: z.string(),
          })
          .nullish(),
      })
    )
    .query(({ input, ctx }) => {
      const { dateFilter } = input;
      return ctx.prisma.event.findMany({
        select: {
          ...EventSelect,
          weighing: {
            include: {
              event: true,
            },
          },
          workoutSession: {
            include: {
              event: true,
              workoutResults: {
                include: {
                  workout: true,
                },
              },
            },
          },
        },
        where: {
          OR: [
            {
              workoutSession: {
                athleteId: ctx.session.user.id,
              },
            },
            {
              weighing: {
                userId: ctx.session.user.id,
              },
            },
          ],
          ...(dateFilter && {
            eventDate: {
              lte: dateFilter.lte,
              gte: dateFilter.gte,
            },
          }),
        },
        orderBy: {
          eventDate: "desc",
        },
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { id } = input;
      ctx.prisma.event.delete({
        where: { id },
        include: {
          weighing: true,
          workoutSession: {
            include: {
              workoutResults: true,
            },
          },
        },
      });
      return {
        id,
      };
    }),
});

export type EventRouterType = typeof eventRouter;
