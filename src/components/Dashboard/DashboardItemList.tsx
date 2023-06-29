interface DashboardItemListProps {
  title?: string;
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
      {title && <h2 className="h2 mt-4 ">{title}</h2>}
      {isLoading ? (
        <div className="mt-1 flex items-center gap-3">
          <span className="loading loading-infinity loading-md"></span>
        </div>
      ) : (
        <div className="relative -ml-4 flex w-[100vw] snap-x snap-mandatory overflow-auto pb-5 pr-4 pt-3  sm:py-5 md:inset-0  md:m-0 md:w-full md:flex-wrap">
          {children}
        </div>
      )}
    </div>
  );
}
