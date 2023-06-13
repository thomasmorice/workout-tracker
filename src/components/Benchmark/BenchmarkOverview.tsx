import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler,
} from "chart.js";
import { useSession } from "next-auth/react";
import { Radar } from "react-chartjs-2";
import { TailSpin } from "react-loading-icons";
import {
  MAX_LEVEL,
  getBenchmarksAndAbilities,
  getAverageLevelPerAbilities,
  getAthleteLevel,
  getChartAccuracy,
} from "../../utils/benchmark";
import { enumToString } from "../../utils/formatting";
import { trpc } from "../../utils/trpc";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function BenchmarkOverview() {
  const { data: sessionData, status } = useSession();
  const { data: benchmarkWorkouts, isFetching } =
    trpc.workout.getAllWorkoutWithResults.useQuery(
      {
        benchmarkOnly: true,
      },
      {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
      }
    );

  const benchmarksAndAbilities = getBenchmarksAndAbilities(
    benchmarkWorkouts || [],
    sessionData?.user?.gender
  );

  const latestChartColor = "102, 26, 230";

  // console.log("benchmarksAndAbilities", benchmarksAndAbilities);

  if (isFetching) {
    return (
      <>
        <div className="mt-8 flex justify-center">
          <TailSpin className="h-8" stroke="#2D68FF" speed={1.2} />{" "}
        </div>
      </>
    );
  }

  const data = {
    labels: getAverageLevelPerAbilities(benchmarksAndAbilities).map(
      (levelPerAbility) =>
        enumToString(levelPerAbility.ability).toUpperCase().split(" ")
    ),
    datasets: [
      {
        label: "Latest results",
        data: getAverageLevelPerAbilities(benchmarksAndAbilities).map(
          (levelPerAbility) => levelPerAbility.level
        ),
        pointBackgroundColor: `rgba(${latestChartColor})`,
        pointHitRadius: 10,
        pointRadius: 1,
        borderWidth: 1.5,
        backgroundColor: `rgba(${latestChartColor}, 0.3)`,
        borderColor: `rgba(${latestChartColor}, 1)`,
        tension: 0.15,
      },
    ],
  };
  const config = {
    type: "radar",
    data: data,
    options: {
      plugins: {
        legend: {
          display: false,
        },
        // datalabels: {
        //   align: "end" as const,
        //   font: {
        //     family: "Work sans",
        //     size: 9.5,
        //     weight: 900,
        //   },
        //   color: `rgba(${latestChartColor})`,

        //   offset: 1,
        //   formatter: (value: number) => {
        //     return Math.round(value);
        //   },
        // },
      },
      scales: {
        r: {
          angleLines: {
            display: false,
          },
          suggestedMin: 0,
          suggestedMax: MAX_LEVEL,
          beginAtZero: true,
          grid: {
            color: [
              "rgb(193, 200, 215, 0)",
              "rgb(193, 200, 215, 0.1)",
              // "rgb(193, 200, 215, 0.1)",
              // "rgb(193, 200, 215, 0.2)",
              // "rgb(193, 200, 215, 0.1)",
            ],
          },
          pointLabels: {
            color: "rgb(193, 200, 215, 1)",
            padding: 4,
            // callback: (value: string) => {
            //   console.log("context", ctx);
            //   return value + ` ()`;
            // },
            font: {
              family: "Work sans",
              size: 10,
              weight: "900",
            },
          },
          ticks: {
            display: false, // Hides the labels in the middel (numbers)
          },
        },
      },
    },
  };

  return (
    <>
      <div className="flex items-center justify-between rounded-3xl bg-base-200 px-8 py-6">
        <div className="flex flex-col items-center">
          <div
            className="radial-progress text-xs font-black text-primary"
            style={
              {
                "--value": Math.round(getAthleteLevel(benchmarksAndAbilities)),
                "--size": "3rem",
                "--thickness": "0.3rem",
              } as React.CSSProperties
            }
          >
            <span className="text-base-content">
              {Math.round(getAthleteLevel(benchmarksAndAbilities))}%
            </span>
          </div>
          <div className="pt-2 text-center text-xs font-bold leading-3">
            Athlete <br /> Level
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div
            className="radial-progress text-xs font-black text-primary"
            style={
              {
                "--value": "100",
                "--size": "3rem",
                "--thickness": "0.3rem",
              } as React.CSSProperties
            }
          >
            <span className="text-base-content">
              {benchmarksAndAbilities?.length || 0}
            </span>
          </div>
          <div className="pt-2 text-center text-xs font-bold leading-3">
            Benchmark <br /> Validated
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div
            className="radial-progress text-xs font-black text-primary"
            style={
              {
                "--value": Math.round(getChartAccuracy(benchmarksAndAbilities)),
                "--size": "3rem",
                "--thickness": "0.3rem",
              } as React.CSSProperties
            }
          >
            <span className="text-base-content">
              {Math.round(getChartAccuracy(benchmarksAndAbilities))}%
            </span>
          </div>
          <div className="pt-2 text-center text-xs font-bold leading-3">
            Chart <br /> Accuracy
          </div>
        </div>
      </div>
      <div className="-z-10 -mt-5  flex w-full">
        <Radar options={{ ...config.options }} data={data} />
      </div>
    </>
  );
}
