import { useMemo } from "react";
import { IoScale } from "react-icons/io5";
import { useWeighingService } from "../../../services/useWeighingService";
import DashboardItem from "../DashboardItem";
import DashboardItemGraph from "../DashboardItemGraph";
import DashboardItemList from "../DashboardItemList";

export default function WeighingInsights() {
  const { getWeighings } = useWeighingService();
  const { data: latestWeighings, isLoading: isLoadingWeights } = getWeighings({
    take: 8,
  });

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
              illustration={<IoScale size={26} />}
              value={getLatestWeight ? `${getLatestWeight.weight}Kg` : ""}
            >
              <DashboardItemGraph
                graphNumbers={[...latestWeighings]
                  .reverse()
                  .map((weighting) => weighting.weight)}
              />
            </DashboardItem>
          )}
        </>
      </DashboardItemList>
    </>
  );
}
