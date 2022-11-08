import { useState } from "react";
import { MdAdd } from "react-icons/md";
import { useWorkoutSessionService } from "../../../services/useWorkoutSessionService";
import Modal from "../../Layout/Navigation/Modal/Modal";
import WorkoutSessionForm from "../../WorkoutSession/WorkoutSessionForm";
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
        <div id="my-modal">
          <Modal onClose={() => set_showAddSessionModal(false)}>
            <>
              <h3 className="text-lg font-bold">Add a session</h3>
              <WorkoutSessionForm onSuccess={() => console.log("success")} />
            </>
          </Modal>
        </div>
      )}

      <DashboardItemList
        isLoading={isLoadingCountSession}
        title="Session metrics"
      >
        {allSessionsCount ? (
          <div className="flex w-full flex-wrap gap-4 py-3 sm:gap-8 sm:py-5">
            <div
              onClick={() => set_showAddSessionModal(true)}
              className="flex cursor-pointer transition-transform hover:scale-105"
            >
              <DashboardItem theme="colored">
                <div className="flex h-full w-full flex-col items-center justify-center text-lg font-bold text-secondary-content">
                  Add a new session
                  <MdAdd className="mt-1 h-8 w-8 transition-all" />
                </div>
              </DashboardItem>
            </div>
          </div>
        ) : (
          <p>
            No session registered yet{" "}
            <span className="text-accent-content">the activity section </span>{" "}
            to add a new session
          </p>
        )}
      </DashboardItemList>
    </>
  );
}
