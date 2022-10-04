import { NextPage } from "next";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import ActivityDashboard from "../components/Activity/ActivityDashboard";
import WeighingForm from "../components/Weighing/WeighingForm";
import WorkoutSessionForm from "../components/WorkoutSession/WorkoutSessionForm";
import { useEventStore } from "../store/EventStore";

const Activities: NextPage = () => {
  const { eventFormState, closeForm } = useEventStore();
  return (
    <div className="pt-2 pb-10">
      {!eventFormState ? (
        <ActivityDashboard />
      ) : (
        <div>
          <h2
            onClick={closeForm}
            className="h2 group flex cursor-pointer items-center gap-3"
          >
            <MdOutlineKeyboardBackspace
              className="transition-transform group-hover:-translate-x-1"
              size={16}
            />
            {eventFormState.includes("session") ? "Session" : "Weighing"} Form
          </h2>
          {eventFormState.includes("session") ? (
            <WorkoutSessionForm onSuccess={closeForm} />
          ) : (
            <WeighingForm onSuccess={closeForm} />
          )}
        </div>
      )}
    </div>
  );
};

export default Activities;
