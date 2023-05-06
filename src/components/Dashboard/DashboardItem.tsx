type DashboardItemProps = {
  title: string;
  illustration: React.ReactNode;
  value?: string | number;
  children: React.ReactNode;
};

export default function DashboardItem({
  title,
  illustration,
  value = "",
  children,
}: DashboardItemProps) {
  return (
    <div className="snap-start px-4">
      <div className="stat relative h-full rounded-xl bg-base-200">
        <div className="stat-figure">{illustration}</div>
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        <div className="stat-desc opacity-100">{children}</div>
      </div>
    </div>
  );
}
