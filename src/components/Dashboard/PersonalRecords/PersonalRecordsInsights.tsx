import { useWorkoutService } from "../../../services/useWorkoutService";
import { Rings } from "react-loading-icons";
import PersonalRecordItem from "./PersonalRecordItem";
import DashboardItem from "../DashboardItem";
import { useState } from "react";
import { MdAdd } from "react-icons/md";
import Modal from "../../Layout/Navigation/Modal/Modal";
import WorkoutSessionForm from "../../WorkoutSession/WorkoutSessionForm";
import DashboardItemList from "../DashboardItemList";

export default function PersonalRecordsInsights({}) {
  const { getInfiniteWorkouts } = useWorkoutService();
  const [showAddSessionModal, set_showAddSessionModal] = useState(false);
  const { data: personalRecordWorkouts, isLoading } = getInfiniteWorkouts({
    workoutTypes: ["ONE_REP_MAX"],
    onlyFetchMine: true,
    orderResults: [
      {
        weight: "desc",
      },
      {
        time: "asc",
      },
      {
        totalReps: "desc",
      },
    ],

    limit: 7,
    withResults: true,
  });

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

      <DashboardItemList isLoading={isLoading} title="Latest personal records">
        {personalRecordWorkouts &&
        personalRecordWorkouts?.pages[0]?.workouts?.length ? (
          <div className="flex w-full gap-4 overflow-x-scroll py-3 sm:gap-8 sm:py-5">
            {/* <div
            onClick={() => set_showAddSessionModal(true)}
            className="flex cursor-pointer transition-transform hover:scale-105"
          >
            <DashboardItem theme="colored">
              <div className="flex h-full w-full flex-col items-center justify-center text-xl font-bold text-secondary-content">
                Add session
                <MdAdd className="mt-1 h-12 w-12 transition-all" />
              </div>
            </DashboardItem>
          </div> */}

            {personalRecordWorkouts &&
              personalRecordWorkouts.pages[0]?.workouts.map((workout) => (
                <PersonalRecordItem
                  key={workout.id}
                  personalRecordWorkout={workout}
                />
              ))}
          </div>
        ) : (
          <p>
            😢 Too bad, you currently have no personal records, start doing some{" "}
            <span className="text-accent-content">one rep max</span> workout!
          </p>
        )}
      </DashboardItemList>
    </>
  );
}
