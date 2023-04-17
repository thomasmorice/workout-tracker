import { ElementType, Prisma, WorkoutType } from "@prisma/client";
import { z } from "zod";

import { protectedProcedure } from "../../trpc";
import { WorkoutExtras, WorkoutSelect } from "./workout-router";

const infiniteWorkoutZodInput = z.object({
  elementTypes: z.nativeEnum(ElementType).array().nullish(),
  workoutTypes: z.nativeEnum(WorkoutType).array().nullish(),
  withResults: z.boolean().nullish(),
  classifiedOnly: z.boolean().nullish(),
  affiliateOnly: z.boolean().nullish(),
  searchTerm: z.string().nullish(),
  dateFilter: z
    .object({
      lte: z.string(),
      gte: z.string(),
    })
    .nullish(),
  orderResults: z.array(z.any()).nullish(),
  orderByMostlyDone: z.boolean().nullish(),
  onlyFetchMine: z.boolean().nullish(),
  ids: z
    .object({
      in: z.array(z.number()).nullish(),
      notIn: z.array(z.number()).nullish(),
    })
    .nullish(),
  limit: z.number().min(1).max(100).nullish(),
  cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
});

const getWhere = (
  props: z.infer<typeof infiniteWorkoutZodInput>,
  userId: string,
  affiliateId?: number | null
) => {
  let where: Prisma.WorkoutWhereInput = {};

  props.elementTypes?.length &&
    (where.elementType = {
      in: props.elementTypes,
    });

  props.workoutTypes?.length &&
    (where.workoutType = {
      in: props.workoutTypes,
    });

  props.classifiedOnly &&
    (where.NOT = {
      elementType: "UNCLASSIFIED",
    });

  props.dateFilter &&
    (where = {
      createdAt: {
        lte: props.dateFilter.lte,
        gte: props.dateFilter.gte,
      },
    });

  // Search term
  props.searchTerm &&
    (where.OR = [
      {
        description: {
          contains: props.searchTerm,
          mode: "insensitive",
        },
      },
      {
        name: {
          contains: props.searchTerm,
          mode: "insensitive",
        },
      },
      {
        ...(parseInt(props.searchTerm) && {
          id: {
            equals: parseInt(props.searchTerm),
          },
        }),
      },
    ]);

  if (props.ids) {
    props.ids.notIn &&
      (where.id = {
        notIn: props.ids.notIn,
      });
    props.ids.in &&
      (where.id = {
        in: props.ids.in,
      });
  }

  props.affiliateOnly &&
    (where = {
      affiliateId: affiliateId,
    });

  // User Selection
  where.AND = {
    OR: [
      {
        creatorId: userId,
      },
      {
        AND: [
          {
            ...(!props.onlyFetchMine && {
              creator: {
                following: {
                  some: {
                    friendUserId: userId,
                  },
                },
              },
            }),
            // elementType: "UNCLASSIFIED",
          },
        ],
      },
    ],
  };
  return where;
};

const getOrderBy = (props: z.infer<typeof infiniteWorkoutZodInput>) => {
  let orderBy: Prisma.Enumerable<Prisma.WorkoutOrderByWithRelationInput> = {};
  if (props.orderByMostlyDone) {
    orderBy.workoutResults = {
      _count: "desc",
    };
  } else {
    orderBy = [
      {
        createdAt: "desc",
      },
      {
        id: "desc",
      },
    ];
  }
  return orderBy;
};

// List of procedures
export const getInfiniteWorkout = protectedProcedure
  .input(infiniteWorkoutZodInput)
  .query(async ({ ctx, input }) => {
    const limit = input.limit ?? 20;
    const { cursor } = input;
    const userAffiliate = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });
    const workouts = await ctx.prisma.workout.findMany({
      take: limit + 1,
      select: {
        ...WorkoutSelect,
        ...WorkoutExtras,
        creator: true,
        _count: {
          select: {
            workoutResults: {
              where: {
                workoutSession: {
                  athleteId: ctx.session.user.id,
                },
              },
            },
          },
        },
      },
      where: getWhere(input, ctx.session.user.id, userAffiliate?.affiliateId),
      orderBy: getOrderBy(input),
      cursor: cursor ? { id: cursor } : undefined,
    });
    let nextCursor: typeof cursor | null = null;
    if (workouts.length > limit) {
      const nextItem = workouts.pop();
      nextCursor = nextItem?.id;
    }
    return {
      workouts,
      nextCursor,
    };
  });

export const getInfiniteWorkoutWithResults = protectedProcedure
  .input(infiniteWorkoutZodInput)
  .query(async ({ ctx, input }) => {
    const limit = input.limit ?? 20;
    const { cursor } = input;
    const workouts = await ctx.prisma.workout.findMany({
      take: limit + 1,
      select: {
        ...WorkoutSelect,
        ...WorkoutExtras,
        creator: true,
        _count: {
          select: {
            workoutResults: {
              where: {
                workoutSession: {
                  athleteId: ctx.session.user.id,
                },
              },
            },
          },
        },
        workoutResults: {
          select: {
            weight: true,

            workoutSession: {
              select: {
                event: true,
              },
            },
          },
        },
      },
      where: getWhere(input, ctx.session.user.id),
      orderBy: getOrderBy(input),
      cursor: cursor ? { id: cursor } : undefined,
    });
    let nextCursor: typeof cursor | null = null;
    if (workouts.length > limit) {
      const nextItem = workouts.pop();
      nextCursor = nextItem?.id;
    }
    return {
      workouts,
      nextCursor,
    };
  });
