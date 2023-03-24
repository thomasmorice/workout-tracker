type WorkoutCardIllustrationProps = {
  isFullScreen: boolean;
  illustration?: string;
};

export default function WorkoutCardIllustration({
  isFullScreen,
  illustration,
}: WorkoutCardIllustrationProps) {
  return (
    <div
      className={`absolute inset-0  w-full bg-cover bg-center bg-no-repeat opacity-50
        ${isFullScreen ? "-z-10 h-96" : "max-h-52 rounded-3xl "}
      `}
      style={{
        backgroundImage: `url(/workout-item/${
          illustration ?? "walking-into-the-gym"
        }.png)`,
      }}
    >
      <div
        style={
          !isFullScreen
            ? {
                background:
                  "radial-gradient(100% 80% at 50% 0%, rgb(0, 0, 0) 0%, rgba(22, 25, 31, 0.27) 50%, rgb(32, 37, 45) 100%)",
              }
            : {
                background:
                  "radial-gradient(100% 80% at 50% 0%, rgb(0, 0, 0) 0%, rgba(22, 25, 31, 0.27) 50%, rgb(42, 48, 60) 100%)",
              }
        }
        className={`absolute inset-0 z-10 ${isFullScreen ? "" : "rounded-3xl"}`}
      />
    </div>
  );
}
