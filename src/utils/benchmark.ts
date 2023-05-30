import { Abilities } from "@prisma/client";
import { inferRouterOutputs } from "@trpc/server";
import { WorkoutRouterType } from "../server/trpc/router/WorkoutRouter/workout-router";

type BenchmarkAndLevelType = {
  benchmarkWorkout: inferRouterOutputs<WorkoutRouterType>["getAllWorkoutWithResults"][number];
  level: number;
}[];

export const MAX_LEVEL = 100;
const chartType: "latest" | "best" = "latest";

export const getLevelFromIndividualWorkout = (
  workout:
    | inferRouterOutputs<WorkoutRouterType>["getAllWorkoutWithResults"][number]
    | inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number]
    | inferRouterOutputs<WorkoutRouterType>["getWorkoutById"]
) => {
  let level: number | undefined = undefined;
  if (workout && workout.workoutResults && workout.workoutResults.length > 0) {
    // has result
    const worstScoreLevel = workout.benchmark?.worstManResult;
    const bestScoreLevel = workout.benchmark?.bestManResult;
    if (worstScoreLevel && bestScoreLevel) {
      level = 1;
      if (workout.workoutType === "FOR_TIME") {
        const isRx =
          (chartType === "latest" && workout?.workoutResults[0]?.isRx) || false;
        if (isRx) {
          level = 10;
        }
        const resultToTakeIntoAccount =
          (chartType === "latest" && workout?.workoutResults[0]?.time) || 0;
        for (
          let i = worstScoreLevel;
          i >= resultToTakeIntoAccount && level < MAX_LEVEL;
          i += (bestScoreLevel - worstScoreLevel) / MAX_LEVEL
        ) {
          level++;
        }
        if (!isRx) {
          level = level / 10;
        }
      } else if (
        workout.workoutType === "ONE_REP_MAX" ||
        workout.workoutType === "X_REP_MAX"
      ) {
        // console.log("Workout: ", workout.name);
        const resultToTakeIntoAccount =
          (chartType === "latest" && workout?.workoutResults[0]?.weight) || 0;
        // console.log("resultToTakeIntoAccount", resultToTakeIntoAccount);
        for (
          let i = worstScoreLevel;
          i <= resultToTakeIntoAccount && level < MAX_LEVEL;
          i += (bestScoreLevel - worstScoreLevel) / MAX_LEVEL
        ) {
          // console.log("score: ", i);
          level++;
        }
        // console.log("END\n\n");
      }
    }
  }
  return level;
};

export const getBenchmarksAndAbilities = (
  benchmarkWorkouts: inferRouterOutputs<WorkoutRouterType>["getAllWorkoutWithResults"]
) => {
  // let userAbilitiesScore: { [key: string]: number[] } = {};
  let benchmarkWorkoutsAndLevel: BenchmarkAndLevelType = [];
  benchmarkWorkouts?.forEach((workout) => {
    const level = getLevelFromIndividualWorkout(workout);
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
