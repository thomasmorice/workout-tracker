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
      let newOrUpdatedEvent = await prisma.event.upsert({
        create: {
          eventDate: input.date,
        },
        update: {
          eventDate: input.date,
        },
        where: {
          id: input.eventId,
        },
      });
      return prisma.weighing.upsert({
        create: {
          weight: input.weight,
          eventId: newOrUpdatedEvent.id,
        },
        update: {
          weight: input.weight,
          eventId: input.eventId,
        },
        where: {
          id: input.id,
        },
      });
    },
  });
