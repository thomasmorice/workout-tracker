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
      className="flex cursor-pointer transition-transform hover:scale-105"
    >
      <DashboardItem theme="colored">
        <div className="flex h-full w-full flex-col items-center justify-center text-lg font-bold text-secondary-content">
          {title}
          <MdAdd className="mt-1 h-8 w-8 transition-all" />
        </div>
      </DashboardItem>
    </div>
  );
}
