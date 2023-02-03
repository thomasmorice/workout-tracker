import arrayShuffle from "array-shuffle";

export const workoutItems: {
  key: string;
  alternatives?: string[];
  illustrationId?: number;
}[] = [
  {
    key: "deadlift",
    alternatives: ["deadlift", "dl"],
    illustrationId: 1,
  },
  {
    key: "snatch",
    alternatives: ["snatch"],
    illustrationId: 1,
  },
  {
    key: "double-unders",
    alternatives: ["double-under", "double under", "doubleunder", "du"],
    illustrationId: 2,
  },
  {
    key: "single-unders",
    alternatives: ["single-under", "single under", "singleunder"],
    illustrationId: 2,
  },
  {
    key: "pullups",
    alternatives: ["pull-up", "pull up", "pullup"],
    // illustrationId: 4,
  },
  {
    key: "backsquat",
    alternatives: ["backsquat", "back squat", "back-squat"],
    illustrationId: 3,
  },
  {
    key: "frontsquat",
    alternatives: ["frontsquat", "front squat", "front-squat"],
    illustrationId: 3,
  },
  {
    key: "muscle-ups",
    alternatives: ["muscle-up", "muscle up", "muscleup"],
    // illustrationId: 4,
  },
  {
    key: "toes-to-bar",
    alternatives: ["toes-to-bar", "toes to bar", "ttb"],
    // illustrationId: 4,
  },
  {
    key: "clean",
    alternatives: ["clean"],
    illustrationId: 1,
  },
  {
    key: "wall walks",
    alternatives: ["wall walk", "wall-walk", "wallwalk"],
    // illustrationId: 4,
  },
  {
    key: "kettlebell swings",
    alternatives: ["kettlebell swing", "kettlebell american swing", "KB swing"],
    illustrationId: 4,
  },
  {
    key: "rower",
    alternatives: ["rower", "cal row", "m row", "row,", "min row"],
    illustrationId: 6,
  },
  {
    key: "pushups",
    alternatives: ["pushup"],
    illustrationId: 5,
  },
  {
    key: "burpees",
    alternatives: ["burpee"],
    illustrationId: 5,
  },
  {
    key: "wallballs",
    alternatives: ["wall ball", "wallball", "WB"],
    illustrationId: 7,
  },
];

export const illustrations: { id: number; filename: string[] }[] = [
  {
    id: 1,
    filename: ["powersnatch"],
  },
  {
    id: 2,
    filename: ["jumping-rope", "jumping-rope-2"],
  },
  {
    id: 3,
    filename: ["frontsquat"],
  },
  {
    id: 4,
    filename: ["kettlebell-swing", "kettlebell-swing-2"],
  },
  {
    id: 5,
    filename: ["pushup", "pushup-2"],
  },
  {
    id: 6,
    filename: ["rower"],
  },
  {
    id: 7,
    filename: ["wallballs"],
  },
  {
    id: 8,
    filename: [
      "walking-into-the-gym",
      "woman-with-bands",
      "preparing-workout",
      "preparing-workout-2",
      "preparing-workout-3",
      "preparing-workout-4",
      "preparing-workout-5",
      "preparing-workout-6",
    ],
  },
];

export const getWorkoutItemsAndRandomIllustrationByDescription = (
  description: string
) => {
  let filenames: string[] = [];
  let featuredItems: typeof workoutItems = [];

  workoutItems.map((item) => {
    if (
      item.alternatives &&
      new RegExp(item.alternatives.join("|"), "i").test(description)
    ) {
      featuredItems.push(item);
    }
  });

  console.log("workoutItems", featuredItems);

  const illustrationId = arrayShuffle(featuredItems).find(
    (item) => item.illustrationId
  )?.illustrationId;

  filenames =
    illustrations.find((i) => i.id === illustrationId ?? 8)?.filename ?? [];

  return {
    items: featuredItems?.map((item) => item.key),
    illustration: arrayShuffle(filenames)[0],
  };
};
