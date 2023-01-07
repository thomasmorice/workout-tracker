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
  Filler,
  ScriptableContext,
} from "chart.js";
import { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type DashboardItemGraphProps = {
  graphNumbers: number[];
};

export default function DashboardItemGraph({
  graphNumbers,
}: DashboardItemGraphProps) {
  const [graphData, set_graphData] = useState<ChartData<"line", number[]>>();
  const [chartColor, set_chartColor] = useState<string>();

  useEffect(() => {
    if (graphNumbers) {
      set_graphData({
        labels: graphNumbers.map((_, index) => index),
        datasets: [
          {
            data: graphNumbers,
          },
        ],
      });
    }
  }, [graphNumbers]);

  useEffect(() => {
    set_chartColor(
      getComputedStyle(document.documentElement).getPropertyValue("--p")
    );
  }, []);

  if (!graphData) {
    return null;
  }

  return (
    <div className="h-12">
      <div className="absolute inset-x-0 bottom-0 z-0  ">
        <Line
          redraw={true}
          height={70}
          data={graphData}
          options={{
            plugins: {
              legend: {
                display: false,
              },
            },
            elements: {
              point: {
                radius: 0,
              },
              line: {
                borderColor: `hsla(${chartColor} / 80%`,
                borderWidth: 1,
                tension: 0.3,
                backgroundColor: ({ chart: { ctx } }) => {
                  const bg = ctx.createLinearGradient(0, 0, 0, 60);
                  bg.addColorStop(0, `hsla(${chartColor} / 60%`);
                  bg.addColorStop(0.95, `hsla(${chartColor} / 0%`);
                  return bg;
                },
                fill: true,
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
                // suggestedMin: Math.min(...graphNumbers),
                // suggestedMax: Math.max(...graphNumbers),
              },
            },
          }}
        />
      </div>
    </div>
  );
}
