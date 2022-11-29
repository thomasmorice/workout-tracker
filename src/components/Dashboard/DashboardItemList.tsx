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
      <h2 className="h2 mt-4">{title}</h2>
      {isLoading ? (
        <div className="flex items-center gap-3">
          <Rings /> {loadingMessage || "Fetching data"}
        </div>
      ) : (
        // <div className="-mr-6 pl-6">
        <div className="relative  left-1/2 right-1/2 -ml-[calc(50vw_-_20px)] -mr-[50vw] flex w-[calc(100vw_-_20px)] gap-4 overflow-auto pt-3 pb-5 pr-4 sm:gap-8 sm:py-5 md:inset-0  md:m-0 md:w-full md:flex-wrap">
          {children}
        </div>
        // </div>
      )}
    </>
  );
}
