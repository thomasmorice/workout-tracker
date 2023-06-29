import { NextPage } from "next";
import ActivityDashboard from "../components/Activity/ActivityDashboard";
import Header from "../components/Layout/Header";
import { useEventStore } from "../store/EventStore";

const Activities: NextPage = () => {
  const { eventBeingEdited, showFormWithEventType, closeForm } =
    useEventStore();
  return (
    <div className="mt-2">
      <Header h1="Activities" />
      <ActivityDashboard />
    </div>
  );
};

export default Activities;
