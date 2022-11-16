import { Difficulty } from "@prisma/client";

export const DifficultyBadge = ({
  difficulty,
}: {
  difficulty: Difficulty | null;
}) => {
  return (
    <>
      {difficulty && (
        <div
          className={`badge badge-outline rounded-none text-xs font-medium text-${difficulty.toLowerCase()}-600
      ${difficulty === "BLACK" ? "border-white bg-black text-white" : ""}`}
        >
          {difficulty}
        </div>
      )}
    </>
  );
};
