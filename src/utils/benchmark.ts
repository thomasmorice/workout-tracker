import { Abilities, Gender } from "@prisma/client";
import { inferRouterOutputs } from "@trpc/server";
import { WorkoutRouterType } from "../server/trpc/router/WorkoutRouter/workout-router";

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

const getResultFromBenchmarkWorkout = ({
  resultType,
  workout,
}: {
  resultType: ResultType;
  workout: BenchmarkWorkoutType;
}) => {
  if (workout?.workoutResults?.length) {
    let resultToTakeIntoAccount = workout.workoutResults[0];
    let rawResultToTakeIntoAccount: number | undefined;
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

      // switch (workout.workoutType) {
      //   case "ONE_REP_MAX":
      //   case "X_REP_MAX":
      //     // result = resultToTakeIntoAccount?.weight || undefined
      //     break;
      //   case "FOR_TIME":
      //     result = resultToTakeIntoAccount?.time || resultToTakeIntoAccount?.totalReps ||   undefined
      //     break;
      //   default:
      //     break;
      // }
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
