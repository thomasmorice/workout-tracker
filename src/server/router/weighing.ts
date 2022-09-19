import { createProtectedRouter } from "./protected-router";
import { prisma } from "../db/client";
import { z } from "zod";
import { CreateWeighingInputSchema } from "../../types/app";
import { TRPCError } from "@trpc/server";

export const weighingRouter = createProtectedRouter()
  .query("getWeightings", {
    input: z.object({
      take: z.number(),
      dateFilter: z
        .object({
          lte: z.string(),
          gte: z.string(),
        })
        .nullish(),
    }),
    resolve({ ctx, input }) {
      const { dateFilter, take } = input;
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
        ...(take && {
          take: take,
        }),
      });
    },
  })
  .mutation("addOrEdit", {
    input: CreateWeighingInputSchema,
    async resolve({ ctx, input }) {
      return await prisma.weighing.upsert({
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
    },
  });
