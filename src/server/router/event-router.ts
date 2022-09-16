import { z } from "zod";
import { createProtectedRouter } from "./protected-router";
import { prisma } from "../db/client";

const EventSelect = {
  id: true,
  eventDate: true,
  createdAt: true,
};

export const eventRouter = createProtectedRouter().query("get-events", {
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
    const events = await prisma.event.findMany({
      select: {
        ...EventSelect,
        weighting: true,
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
            weighting: {
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
    return events;
  },
});
