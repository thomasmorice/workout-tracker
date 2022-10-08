import Link from "next/link";
import { useSidebarStore } from "../../store/SidebarStore";
import Image from "next/future/image";

export default function Logo() {
  const { isSidebarExpanded } = useSidebarStore();
  return (
    <Link href="/">
      <a>
        <div className="flex h-11 flex-row items-center gap-4">
          <div
            className="
relative flex items-center justify-center rounded-lg bg-primary p-3 font-bold text-primary-content"
          >
            <Image src={"/logo.svg"} height={28} width={28} alt={""} />
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
      </a>
    </Link>
  );
}
