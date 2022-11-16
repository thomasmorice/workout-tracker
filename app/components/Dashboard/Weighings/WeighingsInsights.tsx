import { useWeighingService } from "../../../services/useWeighingService";
import DashboardItemList from "../DashboardItemList";
import WeighingItem from "./WeighingItem";

export default function WeighingInsights() {
  const { getWeighings } = useWeighingService();
  const { data: latestWeighings, isLoading: isLoadingWeights } = getWeighings({
    take: 8,
  });

  return (
    <>
      <DashboardItemList
        loadingMessage="fetching weighings"
        isLoading={isLoadingWeights}
        title="Weight metrics"
      >
        <>
          {latestWeighings && latestWeighings.length > 0 && (
            <WeighingItem weighings={latestWeighings} />
          )}
        </>
      </DashboardItemList>
    </>
  );
}
