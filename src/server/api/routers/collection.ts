import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const collectionRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.collection.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  create: protectedProcedure
    .input(z.object({ title: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.collection.create({
        data: {
          title: input.title,
          userId: ctx.session.user.id,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.collection.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
