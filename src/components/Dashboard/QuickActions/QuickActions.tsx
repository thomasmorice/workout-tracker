import { useState } from "react";
import { useEventStore } from "../../../store/EventStore";
import Modal from "../../Layout/Navigation/Modal/Modal";
import WeighingForm from "../../Weighing/WeighingForm";
import WorkoutSessionForm from "../../WorkoutSession/WorkoutSessionForm";
import DashboardItemList from "../DashboardItemList";

export default function QuickActions() {
  const { closeForm } = useEventStore();
  const [showAddSessionModal, set_showAddSessionModal] = useState(false);
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
      {showAddSessionModal && (
        <Modal
          withCloseButton={true}
          onClose={() => set_showAddSessionModal(false)}
        >
          <>
            <h3 className="text-lg font-bold">Add a session</h3>
            <WorkoutSessionForm onSuccess={() => console.log("success")} />
          </>
        </Modal>
      )}
      <DashboardItemList
        loadingMessage=""
        // isLoading={isLoading || isLoadingMostlyDoneWorkout}
        title="Quick actions"
      >
        <>
          <button
            onClick={() => {
              closeForm(); // This will close the workout session form in case it has been opened in the "activities" section
              set_showAddSessionModal(true);
            }}
            className={` btn flex items-center gap-1 text-xs`}
          >
            Add a session
          </button>
          <button
            onClick={() => {
              set_showAddWeightModal(true);
            }}
            className={` btn flex items-center gap-1 text-xs`}
          >
            Add a weighing
          </button>
        </>
      </DashboardItemList>
    </>
  );
}
