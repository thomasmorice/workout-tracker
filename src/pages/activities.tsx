import { NextPage } from "next";
import ActivityDashboard from "../components/Activity/ActivityDashboard";
import Header from "../components/Layout/Header";
import { useEventStore } from "../store/EventStore";

const Activities: NextPage = () => {
  const { eventBeingEdited, showFormWithEventType, closeForm } =
    useEventStore();
  return (
    <div className="">
      <ActivityDashboard />
    </div>
  );
};

export default Activities;
