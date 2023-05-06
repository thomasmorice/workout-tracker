import { router } from "../trpc";
import { authRouter } from "./auth";
import { workoutRouter } from "./WorkoutRouter/workout-router";
import { workoutResultRouter } from "./workout-result-router";
import { workoutSessionRouter } from "./workout-session-router";
import { weighingRouter } from "./weighing-router";
import { eventRouter } from "./event-router";
import { userRouter } from "./user";

export const appRouter = router({
  workout: workoutRouter,
  workoutSession: workoutSessionRouter,
  workoutResult: workoutResultRouter,
  weighing: weighingRouter,
  event: eventRouter,
  auth: authRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
