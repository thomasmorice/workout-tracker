import DashboardItem from "./DashboardItem";
import { MdAdd } from "react-icons/md";

interface DashboardAddItemProps {
  title: string;
  onClick: () => void;
}

export default function DashboardAddItem({
  title,
  onClick,
}: DashboardAddItemProps) {
  return (
    <div
      onClick={onClick}
      className="flex min-w-[165px] cursor-pointer pl-1 transition-transform hover:scale-105"
    >
      <div className={`rounded-xl bg-secondary px-5 py-3`}>
        <div className="flex h-full w-full flex-col items-center justify-center text-center text-base font-bold text-secondary-content">
          {title}
          <MdAdd className="h-7 w-7 transition-all" />
        </div>
      </div>
    </div>
  );
}
