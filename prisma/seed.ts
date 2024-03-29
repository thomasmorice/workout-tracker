import { Difficulty, ElementType, PrismaClient } from "@prisma/client";
import workoutsUnclassified from "../data/workouts-unclassified.json" assert { type: "json" };
import { prisma } from "../src/server/db/client";

const getTypedDifficulty = (difficulty: any) => {
  if (difficulty && difficulty.toUpperCase() in Difficulty) {
    return difficulty.toUpperCase();
  }
  return undefined;
};

const getTypedElementType = (elementType: any) => {
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
          createdAt: workout?.affiliateDate && new Date(workout?.affiliateDate),
          description: workout.description,
          affiliateId: 2290,
          affiliateDate:
            workout?.affiliateDate && new Date(workout?.affiliateDate),
          elementType: getTypedElementType(workout.elementType),
          difficulty: getTypedDifficulty(workout.difficulty),
        },
      });
    } catch (e) {
      console.error("Error on workout:");
      console.log("e", e);
      console.table(workout);
    }
  });
  await prisma.$disconnect();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
