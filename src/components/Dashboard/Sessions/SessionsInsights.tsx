import { useState } from "react";
import { MdAdd } from "react-icons/md";
import { useWorkoutSessionService } from "../../../services/useWorkoutSessionService";
import Modal from "../../Layout/Navigation/Modal/Modal";
import WorkoutSessionForm from "../../WorkoutSession/WorkoutSessionForm";
import DashboardAddItem from "../DashboardAddItem";
import DashboardItem from "../DashboardItem";
import DashboardItemList from "../DashboardItemList";

export default function SessionInsights() {
  const [showAddSessionModal, set_showAddSessionModal] = useState(false);
  const { countAllSessions } = useWorkoutSessionService();
  const { data: allSessionsCount, isLoading: isLoadingCountSession } =
    countAllSessions();

  return (
    <>
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
        isLoading={isLoadingCountSession}
        title="Session metrics"
      >
        <div className="flex w-full flex-wrap gap-4 py-3 sm:gap-8 sm:py-5">
          <DashboardAddItem
            title="Add a session"
            onClick={() => set_showAddSessionModal(true)}
          />

          {allSessionsCount ? <> </> : <></>}
        </div>
      </DashboardItemList>
    </>
  );
}
