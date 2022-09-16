import { z } from "zod";
import { Difficulty, ElementType, Prisma, WorkoutType } from "@prisma/client";
import { InferMutationInput, InferQueryOutput } from "./trpc";

export type WorkoutResultWithWorkout =
  InferMutationInput<"workout-result.addOrEditMany">["workoutResults"][number] & {
    workout: InferQueryOutput<"workout.get-infinite-workouts">["workouts"][number];
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
