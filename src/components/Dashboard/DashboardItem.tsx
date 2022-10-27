import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useState } from "react";
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
  title: string;
  children: React.ReactNode;
  graph: {
    data: number[];
  };
};

export default function DashboardItem({
  title,
  children,
  graph,
}: DashboardItemProps) {
  const data = {
    labels: graph.data.map((_, index) => index),
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
        data: graph.data,
      },
    ],
  };

  const chartOptions = {
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
        suggestedMin: Math.min(...graph.data),
        suggestedMax: Math.max(...graph.data),
      },
    },
  };

  return (
    <div className="relative w-64 overflow-hidden rounded-xl bg-base-200 p-5 pb-16 shadow-sm">
      <div className="text-base text-base-content ">{title}</div>
      {children}
      {graph.data && (
        <div className="absolute inset-x-0 bottom-0  z-0">
          <Line height={80} data={data} options={chartOptions} />
        </div>
      )}
    </div>
  );
}
