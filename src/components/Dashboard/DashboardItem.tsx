import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type DashboardItemProps = {
  title?: string;
  children: React.ReactNode;
  graphNumbers?: number[];
  theme?: "base" | "colored";
};

export default function DashboardItem({
  title,
  children,
  graphNumbers,
  theme,
}: DashboardItemProps) {
  const [graphData, set_graphData] = useState<ChartData<"line", number[]>>();
  const [chartOptions, set_chartOptions] = useState({});

  useEffect(() => {
    if (graphNumbers) {
      set_graphData({
        labels: graphNumbers.map((_, index) => index),
        datasets: [
          {
            fill: "origin",
            backgroundColor: `hsl(${getComputedStyle(
              document.documentElement
            ).getPropertyValue("--s")}`,
            borderColor: `hsl(${getComputedStyle(
              document.documentElement
            ).getPropertyValue("--s")}`,
            tension: 0.3,
            borderWidth: 2,
            data: graphNumbers,
          },
        ],
      });

      set_chartOptions({
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        tooltips: {
          // enabled: false,
        },
        elements: {
          point: {
            radius: 0,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            display: false,
            ticks: {
              display: false,
            },
          },
          y: {
            grid: {
              display: false,
            },
            display: false,
            title: {
              display: false,
            },
            ticks: {
              display: false,
            },
            suggestedMin: Math.min(...graphNumbers),
            suggestedMax: Math.max(...graphNumbers),
          },
        },
      });
    }
  }, [graphNumbers]);

  return (
    <div
      className={`relative flex min-h-[112px] min-w-[256px] flex-col justify-between overflow-hidden rounded-xl p-5 shadow-sm ${
        !theme || theme === "base" ? `bg-base-200` : "bg-secondary"
      }`}
    >
      {title && (
        <div
          className={`text-lg font-semibold text-accent-content  ${
            !theme || theme === "base"
              ? "text-base-content"
              : "text-secondary-content"
          } `}
        >
          {title}
        </div>
      )}
      {children}
      {graphData && (
        <div className="h-12">
          <div className="absolute inset-x-0 bottom-0 z-0  ">
            <Line height={80} data={graphData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
}
