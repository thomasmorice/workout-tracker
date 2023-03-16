import { TailSpin } from "react-loading-icons";

interface DashboardItemListProps {
  title: string;
  isLoading?: boolean;
  loadingMessage?: string;
  children: React.ReactNode;
}

export default function DashboardItemList({
  title,
  isLoading,
  loadingMessage,
  children,
}: DashboardItemListProps) {
  return (
    <div className="">
      <h2 className="h2 mt-4 ">{title}</h2>
      {isLoading ? (
        <div className="mt-1 flex items-center gap-3">
          <TailSpin className="h-6" stroke="#2D68FF" speed={1.2} />{" "}
          {/* {loadingMessage || "Fetching data"} */}
        </div>
      ) : (
        <div className="snap-mandatory snap-x relative -ml-4 w-[100vw] flex overflow-auto pt-3 pb-5 pr-4  sm:py-5 md:inset-0  md:m-0 md:w-full md:flex-wrap">
          {children}
        </div>
      )}
    </div>
  );
}
