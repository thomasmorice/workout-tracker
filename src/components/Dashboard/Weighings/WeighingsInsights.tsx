import { useMemo } from "react";
import { MdMonitorWeight } from "react-icons/md";
import { trpc } from "../../../utils/trpc";
import DashboardItem from "../DashboardItem";
import DashboardItemGraph from "../DashboardItemGraph";
import DashboardItemList from "../DashboardItemList";
import { useSession } from "next-auth/react";

export default function WeighingInsights() {
  const { data: sessionData } = useSession();
  const { data: latestWeighings, isLoading: isLoadingWeights } =
    trpc.weighing.getWeighings.useQuery(
      {
        take: 8,
      },
      {
        enabled: sessionData?.user !== undefined,
      }
    );

  // const hasLostWeight = useMemo(() => {
  //   if (latestWeighings && latestWeighings[0] && latestWeighings[1]) {
  //     return latestWeighings[0].weight < latestWeighings[1].weight;
  //   }
  // }, [latestWeighings]);

  // const getSecondToLastWeight = useMemo(() => {
  //   if (latestWeighings && latestWeighings[1]) {
  //     return latestWeighings[1];
  //   }
  //   return null;
  // }, [latestWeighings]);

  const getLatestWeight = useMemo(() => {
    if (latestWeighings && latestWeighings[0]) {
      return latestWeighings[0];
    }
    return null;
  }, [latestWeighings]);

  return (
    <>
      <DashboardItemList
        loadingMessage="fetching weighings"
        isLoading={isLoadingWeights}
        title="Weight metrics"
      >
        <>
          {latestWeighings && latestWeighings.length > 0 && (
            <DashboardItem
              title="Weighings"
              illustration={<MdMonitorWeight size={32} />}
              value={getLatestWeight ? `${getLatestWeight.weight}Kg` : ""}
            >
              <DashboardItemGraph
                graphNumbers={[...latestWeighings]
                  .reverse()
                  .map((weighing) => weighing.weight)}
              />
            </DashboardItem>
          )}
        </>
      </DashboardItemList>
    </>
  );
}
