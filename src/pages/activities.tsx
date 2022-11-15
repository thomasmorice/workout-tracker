import { NextPage } from "next";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import ActivityDashboard from "../components/Activity/ActivityDashboard";
import Header from "../components/Layout/Header";
import WeighingForm from "../components/Weighing/WeighingForm";
import WorkoutSessionForm from "../components/WorkoutSession/WorkoutSessionForm";
import { useEventStore } from "../store/EventStore";

const Activities: NextPage = () => {
  const { eventTypeToEdit, closeForm } = useEventStore();
  return (
    <div className="">
      {!eventTypeToEdit ? (
        <>
          <Header
            h1={{
              mobile: "Activities",
            }}
          />

          <ActivityDashboard />
        </>
      ) : (
        <>
          {eventTypeToEdit === "workout-session" ? (
            <>
              <Header onGoBack={closeForm} h1={"Session form"} />
              <WorkoutSessionForm onSuccess={closeForm} />
            </>
          ) : (
            <>
              <Header onGoBack={closeForm} h1={"Weighing form"} />
              <WeighingForm onSuccess={closeForm} />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Activities;
