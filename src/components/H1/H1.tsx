import Image from "next/image";

type H1Props = {
  icon?: string;
  line1: string;
  line2?: string;
};

export default function H1({ icon, line1, line2 }: H1Props) {
  return (
    <h1 className="text-4xl font-semibold">
      {line1} <br />
      <div className="relative inline-flex items-center ">
        {line2}
        {icon && (
          <div className="absolute -right-20 -z-20 flex items-center justify-center">
            <Image alt={"gym icon"} src={icon} width={62} height={62} />
          </div>
        )}
      </div>
    </h1>
  );
}
