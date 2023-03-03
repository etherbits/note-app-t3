import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const noteRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ collectionId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.note.findMany({
        where: {
          collectionId: input.collectionId,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        collectionId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.note.create({
        data: {
          title: input.title,
          content: input.content,
          collectionId: input.collectionId,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.note.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
