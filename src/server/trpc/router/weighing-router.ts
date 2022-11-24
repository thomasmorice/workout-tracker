import { z } from "zod";
import { CreateWeighingInputSchema } from "../../../types/app";
import { router, protectedProcedure } from "../trpc";

export const weighingRouter = router({
  getWeighings: protectedProcedure
    .input(
      z.object({
        take: z.number(),
        dateFilter: z
          .object({
            lte: z.string(),
            gte: z.string(),
          })
          .nullish(),
      })
    )
    .query(({ input, ctx }) => {
      const { dateFilter, take } = input;
      return ctx.prisma.weighing.findMany({
        select: {
          id: true,
          event: true,
          user: true,
          weight: true,
        },
        where: {
          userId: ctx.session.user.id,
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
        ...(take && {
          take: take,
        }),
      });
    }),
  getWeighingById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(({ ctx, input }) => {
      const { id } = input;
      return ctx.prisma.weighing.findFirst({
        select: {
          id: true,
          event: true,
          user: true,
          weight: true,
        },
        where: {
          id: id,
          userId: ctx.session.user.id,
        },
        orderBy: {
          event: {
            eventDate: "desc",
          },
        },
      });
    }),
  addOrEdit: protectedProcedure
    .input(CreateWeighingInputSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.weighing.upsert({
        create: {
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          weight: input.weight,

          event: {
            create: {
              eventDate: input.date,
            },
          },
        },
        update: {
          weight: input.weight,
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
});

export type WeighingRouterType = typeof weighingRouter;
