import { Rings } from "react-loading-icons";

interface DashboardItemListProps {
  title: string;
  isLoading?: boolean;
  children: React.ReactElement;
}

export default function DashboardItemList({
  title,
  isLoading,
  children,
}: DashboardItemListProps) {
  return (
    <>
      <h2 className="h2 mt-10 mb-2">{title}</h2>
      {isLoading ? (
        <div className="flex items-center gap-3">
          <Rings /> Fetching data
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
}
