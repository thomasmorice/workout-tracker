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
    <div onClick={onClick} className={` btn flex items-center gap-1 text-xs`}>
      {title}
    </div>
  );
}
