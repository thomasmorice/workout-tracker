import { motion } from "framer-motion";

type WorkoutCardIllustrationProps = {
  mode: "minified" | "expanded" | "full-screen";
  illustration?: string;
};

export default function WorkoutCardIllustration({
  mode,
  illustration,
}: WorkoutCardIllustrationProps) {
  return (
    <motion.div
      layout
      className={`absolute top-0 left-0 z-0 h-full w-full bg-cover bg-no-repeat opacity-50
        ${mode !== "full-screen" ? "max-h-80" : "max-h-96"}
      `}
      transition={{
        backgroundSize: {
          duration: 6,
          ease: "easeInOut",
        },
      }}
      initial={{
        backgroundSize: "100%",
      }}
      animate={{
        backgroundSize:
          mode === "minified" ? "100%" : mode === "expanded" ? "110%" : "115%",
      }}
      style={{
        backgroundImage: `url(/workout-item/${
          illustration ?? "walking-into-the-gym"
        }.png)`,
        backgroundPosition: "50% 30%",
      }}
    >
      <motion.div
        style={{
          background:
            "radial-gradient(100% 80% at 50% 0%, rgb(0, 0, 0) 0%, rgba(22, 25, 31, 0.27) 0%, rgb(32, 37, 45) 140%)",
        }}
        className={`absolute top-0 left-0 z-10 h-full w-full`}
      />
    </motion.div>
  );
}
