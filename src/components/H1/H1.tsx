type H1Props = {
  line1: string;
  line2?: string;
};

export default function H1({ line1, line2 }: H1Props) {
  return (
    <>
      <div
        className="absolute -top-20 left-0 h-72 w-full animate-translate opacity-40 blur-3xl"
        style={{
          // backgroundImage:
          //   "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
          backgroundImage:
            "linear-gradient(225deg, #FF3CAC 0%, #784BA0 50%, #2B86C5 100%)",

          borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
        }}
      ></div>
      <h1 className="text-4xl font-extrabold">
        {line1} <br />
        <div className="relative inline-flex items-center ">{line2}</div>
      </h1>
    </>
  );
}
