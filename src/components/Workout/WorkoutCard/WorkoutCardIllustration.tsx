import { motion } from "framer-motion";

type WorkoutCardIllustrationProps = {
  isFullScreen: boolean;
  illustration?: string;
};

export default function WorkoutCardIllustration({
  isFullScreen,
  illustration,
}: WorkoutCardIllustrationProps) {
  return (
    <motion.div
      layout="position"
      className={`absolute inset-0  max-h-52 w-full bg-cover bg-center bg-no-repeat opacity-50
        ${!isFullScreen ? "rounded-3xl" : "-z-10 "}
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
        backgroundSize: !isFullScreen ? "100%" : "115%",
      }}
      style={{
        backgroundImage: `url(/workout-item/${
          illustration ?? "walking-into-the-gym"
        }.png)`,
      }}
    >
      <motion.div
        style={{
          background:
            "radial-gradient(100% 80% at 50% 0%, rgb(0, 0, 0) 0%, rgba(22, 25, 31, 0.27) 50%, rgb(32, 37, 45) 100%)",
        }}
        className={`absolute inset-0 z-10`}
      />
    </motion.div>
  );
}
