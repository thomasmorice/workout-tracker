import { NextPage } from "next";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import ActivityDashboard from "../components/Activity/ActivityDashboard";
import WeighingForm from "../components/Weighing/WeighingForm";
import WorkoutSessionForm from "../components/WorkoutSession/WorkoutSessionForm";
import { useEventStore } from "../store/EventStore";

const Activities: NextPage = () => {
  const { eventTypeToEdit, closeForm } = useEventStore();
  return (
    <div className="pt-2 pb-10">
      {!eventTypeToEdit ? (
        <ActivityDashboard />
      ) : (
        <div>
          {eventTypeToEdit === "workout-session" ? (
            <WorkoutSessionForm />
          ) : (
            <WeighingForm onSuccess={closeForm} />
          )}
        </div>
      )}
    </div>
  );
};

export default Activities;
