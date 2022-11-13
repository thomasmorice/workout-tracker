import { Rings } from "react-loading-icons";

interface DashboardItemListProps {
  title: string;
  isLoading?: boolean;
  loadingMessage?: string;
  children: React.ReactElement;
}

export default function DashboardItemList({
  title,
  isLoading,
  loadingMessage,
  children,
}: DashboardItemListProps) {
  return (
    <>
      <h2 className="h2 mt-10 mb-2">{title}</h2>
      {isLoading ? (
        <div className="flex items-center gap-3">
          <Rings /> {loadingMessage || "Fetching data"}
        </div>
      ) : (
        <div className="flex w-full gap-4 overflow-x-scroll py-3 sm:gap-8 sm:py-5">
          {children}
        </div>
      )}
    </>
  );
}
