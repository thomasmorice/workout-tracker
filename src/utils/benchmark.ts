import { Abilities, Gender } from "@prisma/client";
import { inferRouterOutputs } from "@trpc/server";
import { WorkoutRouterType } from "../server/trpc/router/WorkoutRouter/workout-router";
import { secondsToMinutesAndSeconds } from "./utils";
import {
  FaHeartbeat,
  FaMoon,
  FaMountain,
  FaShieldAlt,
  FaRunning,
  FaDumbbell,
} from "react-icons/fa";
import { SiFalcon } from "react-icons/si";
import { BsFillLightningChargeFill, BsSpeedometer } from "react-icons/bs";
import { IoShapes } from "react-icons/io5";

type BenchmarkAndLevelType = {
  benchmarkWorkout: inferRouterOutputs<WorkoutRouterType>["getAllWorkoutWithResults"][number];
  level: number;
}[];

type ResultType = "latest" | "best";
type BenchmarkWorkoutType =
  | inferRouterOutputs<WorkoutRouterType>["getAllWorkoutWithResults"][number]
  | inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number]
  | inferRouterOutputs<WorkoutRouterType>["getWorkoutById"];

export const MAX_LEVEL = 100;

export const getFormattedResultFromBenchmarkWorkout = ({
  resultType,
  workout,
}: {
  resultType: ResultType;
  workout: BenchmarkWorkoutType;
}) => {
  const result = getResultFromBenchmarkWorkout({
    resultType,
    workout,
  });
  if (result?.weight) {
    return {
      raw: result.weight,
      formatted: `${result.weight}KG`,
    };
  } else if (result?.totalReps) {
    return {
      raw: result.totalReps,
      formatted: `${result.totalReps} reps`,
    };
  } else if (result?.time) {
    return {
      raw: result.time,
      formatted:
        secondsToMinutesAndSeconds(result.time).minutes +
        ":" +
        secondsToMinutesAndSeconds(result.time).seconds,
    };
  }
};

export const getResultFromBenchmarkWorkout = ({
  resultType,
  workout,
}: {
  resultType: ResultType;
  workout: BenchmarkWorkoutType;
}) => {
  if (workout?.workoutResults?.length) {
    let resultToTakeIntoAccount = workout.workoutResults[0];
    let filteredResults: typeof workout.workoutResults | undefined =
      workout.workoutResults;

    if (resultType === "best") {
      // filter only rx if there is
      if (filteredResults.findIndex((wr) => wr.isRx)) {
        filteredResults.map((res) => res.isRx && res);
      }

      filteredResults.forEach((result) => {
        if (result?.time) {
          if (!resultToTakeIntoAccount?.time) {
            resultToTakeIntoAccount = result;
          } else if (
            resultToTakeIntoAccount?.time &&
            result.time < resultToTakeIntoAccount.time
          ) {
            resultToTakeIntoAccount = result;
          }
        } else if (
          resultToTakeIntoAccount?.weight &&
          resultToTakeIntoAccount.weight < (result.weight || 0)
        ) {
          resultToTakeIntoAccount = result;
        }
      });
    }
    return resultToTakeIntoAccount;
  }
};

export const getLevelFromIndividualWorkout = (
  workout: BenchmarkWorkoutType,
  gender: Gender,
  resultType: ResultType = "latest"
) => {
  let level: number | undefined = undefined;
  const resultToTakeIntoAccount = getResultFromBenchmarkWorkout({
    workout: workout,
    resultType: resultType,
  });
  if (resultToTakeIntoAccount) {
    const benchmarkScores = {
      worst:
        gender === "MALE"
          ? workout.benchmark?.worstManResult
          : workout.benchmark?.worstWomanResult,
      best:
        gender === "MALE"
          ? workout.benchmark?.bestManResult
          : workout.benchmark?.bestWomanResult,
    };

    if (benchmarkScores.worst && benchmarkScores.best) {
      level = resultToTakeIntoAccount?.isRx ? 10 : 1;

      const rawLevelValue =
        resultToTakeIntoAccount?.time ||
        resultToTakeIntoAccount?.totalReps ||
        resultToTakeIntoAccount?.weight;

      if (resultToTakeIntoAccount?.time && rawLevelValue) {
        for (
          let i = benchmarkScores.worst;
          i >= rawLevelValue && level < MAX_LEVEL;
          i += (benchmarkScores.best - benchmarkScores.worst) / MAX_LEVEL
        )
          level++;
      } else if (rawLevelValue) {
        for (
          let i = benchmarkScores.worst;
          i <= rawLevelValue && level < MAX_LEVEL;
          i += (benchmarkScores.best - benchmarkScores.worst) / MAX_LEVEL
        )
          level++;
      }
      if (level === 1) {
        console.log(workout);
      }
    }
  }

  return level;
};

export const getBenchmarksAndAbilities = (
  benchmarkWorkouts: inferRouterOutputs<WorkoutRouterType>["getAllWorkoutWithResults"],
  gender: Gender
) => {
  // let userAbilitiesScore: { [key: string]: number[] } = {};
  let benchmarkWorkoutsAndLevel: BenchmarkAndLevelType = [];
  benchmarkWorkouts?.forEach((workout) => {
    const level = getLevelFromIndividualWorkout(workout, gender, "latest");
    if (level) {
      benchmarkWorkoutsAndLevel.push({
        benchmarkWorkout: workout,
        level: level,
      });
    }
  });
  return benchmarkWorkoutsAndLevel;
};

export const getAverageLevelPerAbilities = (
  benchmarkWorkoutsAndLevel: BenchmarkAndLevelType
) => {
  let userAbilitiesScore: { [key: string]: number[] } = {};
  benchmarkWorkoutsAndLevel.forEach((benchmarkWorkoutAndLevel) => {
    benchmarkWorkoutAndLevel.benchmarkWorkout?.benchmark?.abilitiesRequired.forEach(
      (ability) => {
        userAbilitiesScore[ability] = [
          ...(userAbilitiesScore[ability] || []),
          benchmarkWorkoutAndLevel.level,
        ];
      }
    );
  });
  return Object.keys(userAbilitiesScore).map((ability) => ({
    ability: ability,
    level: Math.round(
      (userAbilitiesScore[ability]?.reduce((p, c) => p + c, 0) || 0) /
        (userAbilitiesScore[ability]?.length || 0)
    ),
    accuracy: userAbilitiesScore[ability]?.length || 0,
  }));
};

export const getAbilities = (
  benchmarkWorkoutsAndLevel: BenchmarkAndLevelType
) => {
  let allAbilities: Abilities[] = [];
  return benchmarkWorkoutsAndLevel.forEach((benchmarkWorkoutAndLevel) => {
    benchmarkWorkoutAndLevel.benchmarkWorkout?.benchmark?.abilitiesRequired.forEach(
      (ability) => allAbilities.push(ability)
    );
  });
  return allAbilities;
};

export const getAthleteLevel = (
  benchmarkWorkoutsAndLevel: BenchmarkAndLevelType
) => {
  return (
    getAverageLevelPerAbilities(benchmarkWorkoutsAndLevel).reduce(
      (total, acc) => total + acc.level,
      0
    ) / getAverageLevelPerAbilities(benchmarkWorkoutsAndLevel).length
  );
};

export const getChartAccuracy = (
  benchmarkWorkoutsAndLevel: BenchmarkAndLevelType
) => {
  const averageLevelPerAbilities = getAverageLevelPerAbilities(
    benchmarkWorkoutsAndLevel
  );
  const consideredFullAccuracy = 4;
  return (
    averageLevelPerAbilities.reduce((total, acc) => {
      let accuracy =
        acc.accuracy >= consideredFullAccuracy
          ? consideredFullAccuracy
          : acc.accuracy;
      return total + (accuracy * 100) / consideredFullAccuracy;
    }, 0) / averageLevelPerAbilities.length
  );
};

export const getIconFromBenchmarkAbility = (ability: `${Abilities}`) => {
  switch (ability) {
    case "ENDURANCE":
      return FaMountain;
    case "AGILITY":
      return SiFalcon;
    case "CARDIOVASCULAR_FITNESS":
      return FaHeartbeat;
    case "MENTAL_TOUGHNESS":
      return FaShieldAlt;
    case "POWER":
      return BsFillLightningChargeFill;
    case "RECOVERY":
      return FaMoon;
    case "SPEED":
      return BsSpeedometer;
    case "STAMINA":
      return FaRunning;
    case "STRENGTH":
      return FaDumbbell;
    case "TECHNIQUE":
      return IoShapes;
    default:
      return FaMountain;
  }
};
