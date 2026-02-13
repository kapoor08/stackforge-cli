import { router, publicProcedure } from './trpc';
import { z } from 'zod';

export const appRouter = router({
  hello: publicProcedure.input(z.string().optional()).query(({ input }) => `hello ${input ?? 'world'}`),
  addUser: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input }) => ({ id: 1, name: input.name }))
});

export type AppRouter = typeof appRouter;
