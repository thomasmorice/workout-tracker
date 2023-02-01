import { motion } from "framer-motion";

type WorkoutCardIllustrationProps = {
  mode: "minified" | "expanded" | "full-screen";
};

export default function WorkoutCardIllustration({
  mode,
}: WorkoutCardIllustrationProps) {
  return (
    <motion.div
      layout
      className="absolute top-0 left-0 z-0 h-full max-h-80 w-full bg-cover bg-no-repeat opacity-50"
      transition={{
        backgroundSize: {
          duration: 3,
          ease: "easeInOut",
        },
      }}
      initial={{
        backgroundSize: "100%",
      }}
      animate={{
        backgroundSize:
          mode === "minified" ? "100%" : mode === "expanded" ? "110%" : "120%",
      }}
      style={{
        backgroundImage: "url(/workout-item/wallballs.png)",
        backgroundPosition: "50%",
      }}
    >
      <motion.div
        style={{
          background:
            "radial-gradient(100% 80% at 50% 0%, rgb(0, 0, 0) 0%, rgba(22, 25, 31, 0.27) 0%, rgb(32, 37, 45) 91%)",
        }}
        className={`absolute top-0 left-0 z-10 h-full w-full ${
          mode === "minified" ? "opacity-70" : "opacity-100"
        }`}
      />
    </motion.div>
  );
}
