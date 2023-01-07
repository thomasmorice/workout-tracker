import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/">
      <div className="flex h-11 flex-row items-center gap-4">
        <div className="relative flex h-12 w-full items-center justify-center rounded-lg font-bold">
          <Image src={"/logo-no-text.png"} height={42} width={42} alt={""} />
        </div>
      </div>
    </Link>
  );
}
