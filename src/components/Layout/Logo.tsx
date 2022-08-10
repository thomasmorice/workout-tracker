import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/">
      <a>
        <div className="flex h-11 flex-row items-center gap-4">
          <div
            className="
relative flex h-11 w-11 items-center justify-center rounded-lg bg-primary font-bold text-primary-content"
          >
            WT
          </div>
          <div className="flex h-full flex-col justify-between">
            <div className="text-xl font-medium">Workout tracker</div>
            <div className="text-xs font-light opacity-80">
              contact@workout-tracker.io
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}
