import Link from "next/link";
import { useSidebarStore } from "../../store/SidebarStore";
import Image from "next/image";

export default function Logo() {
  const { isSidebarExpanded } = useSidebarStore();
  return (
    <Link href="/">
      <div className="flex h-11 flex-row items-center gap-4">
        <div
          className="
relative flex h-12 w-full items-center justify-center rounded-lg bg-primary font-bold text-primary-content"
        >
          <Image src={"/logo-white.svg"} height={36} width={36} alt={""} />
        </div>

        {isSidebarExpanded && (
          <div className="flex h-full flex-col justify-between">
            <div className="text-xl font-medium">Workout tracker</div>
            <div className="text-xs font-light opacity-80">
              contact@workout-tracker.io
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
