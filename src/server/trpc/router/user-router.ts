import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const userRouter = router({
  getAffiliates: protectedProcedure
    .input(
      z.object({
        term: z.string().min(3),
      })
    )
    .query(async ({ input }) => {
      return fetch(
        `https://map.crossfit.com/ac.php?term=${input.term}&type=affiliates`
      )
        .then((response) => response.json())
        .then((result) => result);
    }),
  getAffiliateDetails: protectedProcedure
    .input(
      z.object({
        aid: z.number(),
      })
    )
    .query(async ({ input }) => {
      return fetch(
        `https://map.crossfit.com/getAffiliateInfo.php?aid=${input.aid}`
      )
        .then((response) => response.json())
        .then((result) => result);
    }),
  addAffiliate: protectedProcedure
    .input(
      z.object({
        affiliateId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        data: {
          affiliateId: input.affiliateId,
        },
        where: {
          id: ctx.session.user.id,
        },
      });
    }),
  getUserAffiliate: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });
    if (user && user.affiliateId) {
      return fetch(
        `https://map.crossfit.com/getAffiliateInfo.php?aid=${user.affiliateId}`
      )
        .then((response) => response.json())
        .then((result) => result);
    }
    return null;
  }),
  getUser: protectedProcedure.query(async ({ ctx }) => {
    let affiliate;
    let user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });

    if (user?.affiliateId) {
      affiliate = await fetch(
        `https://map.crossfit.com/getAffiliateInfo.php?aid=${user.affiliateId}`
      )
        .then((response) => response.json())
        .then((result) => result);
    }
    return {
      user: user,
      affiliate: affiliate,
    };
  }),
});
