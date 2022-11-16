import {
  differenceInDays,
  format,
  formatDistance,
  isAfter,
  isBefore,
} from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";
import { WorkoutResultWithWorkout } from "../types/app";
import { InferQueryOutput } from "../types/trpc";

type SessionType = NonNullable<
  InferQueryOutput<"event.get-events">[number]["workoutSession"]
>;

export const getSessionTotalTime = (session: SessionType) => {
  return session.workoutResults.reduce(
    (sum, current) => sum + (current.workout.totalTime ?? 0),
    0
  );
};

export const resultHasBenchmarkeableWorkout = (
  result: WorkoutResultWithWorkout | SessionType["workoutResults"][number]
) => {
  return result.time || result.totalReps || result.weight;
};

export const workoutResultIsFilled = (
  result: WorkoutResultWithWorkout | SessionType["workoutResults"][number]
) => {
  return resultHasBenchmarkeableWorkout(result) || result.description;
};

export const sessionHasResults = (session: SessionType) => {
  if (isBefore(session.event.eventDate, Date.now())) {
    if (
      session.workoutResults.some((result) => workoutResultIsFilled(result))
    ) {
      return true;
    }
  }
  return false;
};

export const getSessionTitle = (session: SessionType) => {
  return isBefore(new Date(), session.event.eventDate)
    ? "Session planned"
    : sessionHasResults(session)
    ? "Result registered"
    : "Session registered";
};

export const getActivityDate = (
  event: InferQueryOutput<"event.get-events">[number]
) => {
  if (isBefore(event.eventDate, Date.now())) {
    if (Math.abs(differenceInDays(event.eventDate, Date.now())) > 4) {
      return format(
        zonedTimeToUtc(event.eventDate, "Europe/Stockholm"),
        "LLLL do, u 'at' p"
      );
    } else {
      return `${formatDistance(new Date(), event.eventDate)} ago`;
    }
  } else {
    return `In ${formatDistance(new Date(), event.eventDate)}`;
  }
};
