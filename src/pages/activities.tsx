import { NextPage } from "next";
import ActivityDashboard from "../components/Activity/ActivityDashboard";
import H1 from "../components/H1/H1";
import Header from "../components/Layout/Header";
import { useEventStore } from "../store/EventStore";

const Activities: NextPage = () => {
  const { eventBeingEdited, showFormWithEventType, closeForm } =
    useEventStore();
  return (
    <div className="mt-2">
      <H1>Activities</H1>
      <ActivityDashboard />
    </div>
  );
};

export default Activities;
