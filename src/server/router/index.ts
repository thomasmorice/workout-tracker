// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { protectedExampleRouter } from "./protected-example-router";
import { workoutRouter } from "./workout";
import { workoutResultRouter } from "./workout-result";
import { workoutSessionRouter } from "./workout-session";
import { weighingRouter } from "./weighing";
import { eventRouter } from "./event-router";

export const appRouter = createRouter()
  .transformer(superjson)
  // .merge("example.", exampleRouter)
  // .merge("question.", protectedExampleRouter)
  .merge("workout.", workoutRouter)
  .merge("workout-session.", workoutSessionRouter)
  .merge("workout-result.", workoutResultRouter)
  .merge("weighing.", weighingRouter)
  .merge("event.", eventRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
