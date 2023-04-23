import Image from "next/image";

type H1Props = {
  icon: string;
  line1: string;
  line2?: string;
};

export default function H1({ icon, line1, line2 }: H1Props) {
  return (
    <h1 className="text-4xl">
      {line1} <br />
      <div className="relative inline-flex items-center ">
        {line2}
        <div className="absolute -right-20 -z-20 flex items-center justify-center">
          <Image alt={"gym icon"} src={icon} width={62} height={62} />
          {/* <div
            className="absolute -right-8 -z-20 h-40 w-40"
            style={{
              background:
                "radial-gradient(circle, rgba(142,214,195,0.6) 0%, rgba(42,48,60,0) 30%)",
            }}
          ></div> */}
        </div>
      </div>
    </h1>
  );
}
