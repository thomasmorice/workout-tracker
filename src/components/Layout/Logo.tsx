import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <div className="h-full">
      <Image
        src={"/gorilla-logo-transparent.png"}
        height={32}
        width={32}
        alt={""}
      />
    </div>
  );
}
