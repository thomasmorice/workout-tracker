import { router } from "../trpc";
import { authRouter } from "./auth";
import { workoutRouter } from "./workout-router";
import { workoutResultRouter } from "./workout-result-router";
import { workoutSessionRouter } from "./workout-session-router";
import { weighingRouter } from "./weighing-router";
import { eventRouter } from "./event-router";

export const appRouter = router({
  workout: workoutRouter,
  workoutSession: workoutSessionRouter,
  workoutResult: workoutResultRouter,
  weighing: weighingRouter,
  event: eventRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
