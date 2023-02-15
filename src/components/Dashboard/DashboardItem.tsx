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
    <div className="stat relative max-w-[280px] rounded-xl bg-base-200">
      <div className="stat-figure">{illustration}</div>
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-desc opacity-100">{children}</div>
    </div>
  );
}
