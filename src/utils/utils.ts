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

type SessionType =
  InferQueryOutput<"workout-session.get-workout-sessions">[number];

export const getSessionTotalTime = (session: SessionType) => {
  return session.workoutResults.reduce(
    (sum, current) => sum + (current.workout.totalTime ?? 0),
    0
  );
};

export const sessionHasBenchmarkeableWorkout = (session: SessionType) => {
  session.workoutResults.some(
    (result) => result.time || result.totalReps || result.weight
  );
};

export const workoutResultIsFilled = (
  result: WorkoutResultWithWorkout | SessionType["workoutResults"][number]
) => {
  return result.time || result.totalReps || result.weight || result.description;
};

export const sessionHasResults = (session: SessionType) => {
  if (isBefore(session.date, Date.now())) {
    if (
      session.workoutResults.some((result) => workoutResultIsFilled(result))
    ) {
      return true;
    }
  }
  return false;
};

export const getSessionTitle = (session: SessionType) => {
  return isBefore(new Date(), session.date)
    ? "Session planned"
    : sessionHasResults(session)
    ? "Result registered"
    : "Session registered";
};

export const getSessionDate = (session: SessionType) => {
  if (isBefore(session.date, Date.now())) {
    if (Math.abs(differenceInDays(session.date, Date.now())) > 4) {
      return format(
        zonedTimeToUtc(session.date, "Europe/Stockholm"),
        "LLLL do, u 'at' p"
      );
    } else {
      return `${formatDistance(new Date(), session.date)} ago`;
    }
  } else {
    return `In ${formatDistance(new Date(), session.date)}`;
  }
};
