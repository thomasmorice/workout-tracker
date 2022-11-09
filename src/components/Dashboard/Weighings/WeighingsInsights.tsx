import { useState } from "react";
import { useWeighingService } from "../../../services/useWeighingService";
import Modal from "../../Layout/Navigation/Modal/Modal";
import WeighingForm from "../../Weighing/WeighingForm";
import DashboardAddItem from "../DashboardAddItem";
import DashboardItem from "../DashboardItem";
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
            <WeighingForm onSuccess={() => console.log("success")} />
          </>
        </Modal>
      )}

      <DashboardItemList isLoading={isLoadingWeights} title="Weight metrics">
        {latestWeighings?.length ? (
          <div className="flex w-full flex-wrap gap-4 py-3 sm:gap-8 sm:py-5">
            <DashboardAddItem
              title="Add weighing"
              onClick={() => set_showAddWeightModal(true)}
            />
            <WeighingItem weighings={latestWeighings} />
          </div>
        ) : (
          <p>
            Seems like you haven&apos;t added any weight yet, use{" "}
            <span className="text-accent-content">the activity section </span>{" "}
            to add your latest weight and start tracking it regularely
          </p>
        )}
      </DashboardItemList>
    </>
  );
}
