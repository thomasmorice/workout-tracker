import { z } from "zod";
import { Difficulty, ElementType, WorkoutType } from "@prisma/client";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { WorkoutResultRouterType } from "../server/trpc/router/workout-result-router";
import type { WorkoutRouterType } from "../server/trpc/router/workout-router";

export type WorkoutResultInputsWithWorkout =
  inferRouterInputs<WorkoutResultRouterType>["addOrEditMany"]["workoutResults"][number] & {
    workout: inferRouterOutputs<WorkoutRouterType>["getInfiniteWorkout"]["workouts"][number];
  };

export const CreateWorkoutInputSchema = z.object({
  id: z.number().optional(),
  name: z.string().nullable(),
  description: z.string().min(1),
  workoutType: z.nativeEnum(WorkoutType).nullable(),
  difficulty: z.nativeEnum(Difficulty).nullable(),
  elementType: z.nativeEnum(ElementType).default("UNCLASSIFIED"),
  totalTime: z.number().nullable(),
  isDoableAtHome: z.boolean().default(false),
});

export const GetAllWorkoutsInputSchema = z.object({
  elementTypes: z.nativeEnum(ElementType).array().nullish(),
  workoutTypes: z.nativeEnum(WorkoutType).array().nullish(),
  withResults: z.boolean().nullish(),
  classifiedOnly: z.boolean().nullish(),
  searchTerm: z.string().nullish(),
  orderResults: z.array(z.any()).nullish(),
  orderByMostlyDone: z.boolean().nullish(),
  onlyFetchMine: z.boolean().nullish(),
  ids: z
    .object({
      in: z.array(z.number()).nullish(),
      notIn: z.array(z.number()).nullish(),
    })
    .nullish(),
  limit: z.number().min(1).max(100).nullish(),
  cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
});

export const CreateWorkoutResultInputSchema = z.object({
  id: z.number().optional(),
  workoutId: z.number(),
  workoutSessionId: z.number().optional(),
  description: z.string().nullish(),
  rating: z.number().nullish(),
  order: z.number().nullish(),
  shouldRecommendWorkoutAgain: z.boolean().optional(),
  isRx: z.boolean().nullish(),
  totalReps: z.number().nullish(),
  weight: z.number().nullish(),
  time: z.number().nullish(),
  workout: CreateWorkoutInputSchema.extend({
    id: z.number(), // Yep, id is mandatory in workout result, you can't add a result to a non existing workout..
  }),
});

export const CreateWorkoutSessionInputSchema = z.object({
  id: z.number().optional(), // if not set: create else : edit
  date: z.date(),
  eventId: z.number().optional(),
  workoutResults: z.array(CreateWorkoutResultInputSchema),
});

export const CreateWeighingInputSchema = z.object({
  id: z.number().optional(), // if not set: create else : edit
  eventId: z.number().optional(),
  date: z.date(),
  weight: z.number(),
});
