import { useState } from "react";
import { useWeighingService } from "../../../services/useWeighingService";
import Modal from "../../Layout/Navigation/Modal/Modal";
import WeighingForm from "../../Weighing/WeighingForm";
import DashboardAddItem from "../DashboardAddItem";
import DashboardItemList from "../DashboardItemList";
import WeighingItem from "./WeighingItem";

export default function WeighingInsights() {
  const { getWeighings } = useWeighingService();
  const { data: latestWeighings, isLoading: isLoadingWeights } = getWeighings({
    take: 8,
  });
  const [showAddWeightModal, set_showAddWeightModal] = useState(false);

  return (
    <>
      {showAddWeightModal && (
        <Modal onClose={() => set_showAddWeightModal(false)}>
          <>
            <h3 className="text-lg font-bold">Add a weighing</h3>
            <WeighingForm onSuccess={() => set_showAddWeightModal(false)} />
          </>
        </Modal>
      )}

      <DashboardItemList isLoading={isLoadingWeights} title="Weight metrics">
        <div className="flex w-full flex-wrap gap-4 py-3 sm:gap-8 sm:py-5">
          <DashboardAddItem
            title="Add a weighing"
            onClick={() => set_showAddWeightModal(true)}
          />
          {latestWeighings && latestWeighings.length > 0 && (
            <WeighingItem weighings={latestWeighings} />
          )}
        </div>
      </DashboardItemList>
    </>
  );
}
