import { Difficulty, ElementType, PrismaClient } from "@prisma/client";
import workoutsUnclassified from "../data/workouts-unclassified.json" assert { type: "json" };

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

const getTypedDifficulty = (difficulty) => {
  if (difficulty && difficulty.toUpperCase() in Difficulty) {
    return difficulty.toUpperCase();
  }
  return undefined;
};

const getTypedElementType = (elementType) => {
  if (elementType && elementType.toUpperCase() in ElementType) {
    return elementType.toUpperCase();
  }
  return undefined;
};

async function main() {
  await prisma.workout.deleteMany({
    where: {
      elementType: "UNCLASSIFIED",
    },
  });
  await workoutsUnclassified.forEach(async (workout) => {
    try {
      await prisma.workout.create({
        data: {
          creatorId: "cl6jsjxy00006uyo8h2v8fr2e", // My user id
          createdAt: new Date(workout.createdAt),
          description: workout.description,
          elementType: getTypedElementType(workout.elementType),
          difficulty: getTypedDifficulty(workout.difficulty),
        },
      });
    } catch (e) {
      console.error("Error on workout:");
      console.table(workout);
    }
  });
}

main().finally(async () => {
  await prisma.$disconnect();
});
