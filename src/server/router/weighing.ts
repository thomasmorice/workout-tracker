import { createProtectedRouter } from "./protected-router";
import { prisma } from "../db/client";
import { z } from "zod";
import { CreateWeighingInputSchema } from "../../types/app";

export const weighingRouter = createProtectedRouter()
  .query("getWeightings", {
    input: z.object({
      dateFilter: z
        .object({
          lte: z.string(),
          gte: z.string(),
        })
        .nullish(),
    }),
    resolve({ ctx, input }) {
      const { dateFilter } = input;
      return prisma.weighing.findMany({
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
      });
    },
  })
  .mutation("addOrEdit", {
    input: CreateWeighingInputSchema,
    async resolve({ ctx, input }) {
      return await prisma.weighing.upsert({
        create: {
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
    },
  });
