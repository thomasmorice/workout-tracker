import { inferRouterOutputs } from "@trpc/server";
import {
  differenceInDays,
  format,
  formatDistance,
  isAfter,
  isBefore,
} from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";
import { EventRouterType } from "../server/trpc/router/event-router";
import { WorkoutRouterType } from "../server/trpc/router/WorkoutRouter/workout-router";
import { WorkoutResultInputsWithWorkout } from "../types/app";

type SessionType = NonNullable<
  inferRouterOutputs<EventRouterType>["getEvents"][number]["workoutSession"]
>;

export const getSessionTotalTime = (session: SessionType) => {
  return session.workoutResults.reduce(
    (sum, current) => sum + (current.workout.totalTime ?? 0),
    0
  );
};

export const resultHasBenchmarkeableWorkout = (
  result:
    | inferRouterOutputs<WorkoutRouterType>["getWorkoutById"]["workoutResults"][number]
    | WorkoutResultInputsWithWorkout
) => {
  return result.time || result.totalReps || result.weight;
};

export const workoutResultIsFilled = (result: any) => {
  return (
    result.isRx ||
    (result.description && result.description !== "") ||
    result.totalReps ||
    result.weight ||
    result.rating ||
    result.time
  );
};

export const sessionHasResultsFilled = (session: SessionType) => {
  if (isBefore(session.event.eventDate, Date.now())) {
    if (
      session.workoutResults.every((result) => workoutResultIsFilled(result))
    ) {
      return true;
    }
  }
  return false;
};

export const getSessionTitle = (session: SessionType) => {
  return isBefore(new Date(), session.event.eventDate)
    ? "Session planned"
    : sessionHasResultsFilled(session)
    ? "Result registered"
    : "Session registered";
};

export const getActivityDate = (
  event: inferRouterOutputs<EventRouterType>["getEvents"][number]
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

// export const classifyWorkout = (
//   fullWorkout: WorkoutType,
//   selectedText: string
// ) => {
//   let timecap = null;
//   const isEmom = selectedText.match(/(\d+)\s*x\s*E(\d+)([\.,]\d+)M/);
//   const isEmomWithSeconds = selectedText.match(/(\d+)\s*x\s*E(\d+)s/);
//   const hasTimecap = selectedText.match(/(\d+)\s*(m[ni]n)/);
//   if (isEmom && isEmom[1] && isEmom[2]) {
//     timecap = parseInt(isEmom[1], 10) * parseInt(isEmom[2], 10);
//   } else if (
//     isEmomWithSeconds &&
//     isEmomWithSeconds[1] &&
//     isEmomWithSeconds[2]
//   ) {
//     timecap =
//       parseInt(isEmomWithSeconds[1], 10) *
//       (parseInt(isEmomWithSeconds[2], 10) / 60);
//   }
//   {
//     if (hasTimecap && hasTimecap[1]) {
//       timecap = parseInt(hasTimecap[1], 10);
//     }
//   }

//   return {
//     ...fullWorkout,
//     affiliateId: 2290, // Todo, use the affiliate ID from the user

//     description: selectedText,
//     ...(selectedText.includes("STRENGTH") && {
//       elementType: "STRENGTH",
//     }),

//     ...(selectedText.includes("A.") && {
//       elementType: "STRENGTH_OR_SKILLS",
//       description: selectedText.replace(/^A\.\s*/, ""),
//     }),
//     ...(selectedText.includes("B.") && {
//       elementType: "WOD",
//       description: selectedText.replace(/^B\.\s*/, ""),
//     }),
//     ...(/INTENSE MOBILITY/i.test(selectedText) && {
//       elementType: "INTENSE_MOBILITY",
//       description: selectedText.replace(/^INTENSE MOBILITY\.\s*/, ""),
//     }),
//     ...(/AMRAP/i.test(selectedText) && {
//       workoutType: "AMRAP",
//     }),
//     ...(/FORTIME/i.test(selectedText) && {
//       workoutType: "FOR_TIME",
//     }),

//     ...(isEmom && {
//       workoutType: "EMOM",
//     }),

//     totalTime: timecap,
//   };
// };
