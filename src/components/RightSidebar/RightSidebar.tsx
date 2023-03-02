import { MdOutlineKeyboardBackspace } from "react-icons/md";
import WorkoutSessionForm from "../WorkoutSession/WorkoutSessionForm";
import ActivityDashboard from "../Activity/ActivityDashboard";
import WeighingForm from "../Weighing/WeighingForm";
import { useEventStore } from "../../store/EventStore";
import AvatarButton from "../AvatarButton/AvatarButton";
import { MdNotifications } from "react-icons/md";

export default function RightSidebar() {
  const { showFormWithEventType, closeForm } = useEventStore();

  return (
    <>
      <aside
        className={`sidebar-shadow fixed bottom-0 right-0 z-30 h-full w-80 overflow-y-auto overflow-x-hidden border-l px-4 py-4 md:h-full`}
      >
        <div className="mx-auto flex max-w-xs flex-col">
          <div className="flex items-center justify-between">
            <AvatarButton />
            <div>
              <button type="button" className="btn-ghost btn-circle btn">
                <MdNotifications size="24" />
              </button>
            </div>
          </div>

          {/* <div className="mt-6">
            {!showFormWithEventType ? (
              <ActivityDashboard />
            ) : (
              <div>
                <h2
                  onClick={closeForm}
                  className="h2 group hidden cursor-pointer items-center gap-3 md:flex"
                >
                  <MdOutlineKeyboardBackspace
                    className="transition-transform group-hover:-translate-x-1"
                    size={16}
                  />
                  {showFormWithEventType === "workout-session"
                    ? "Session"
                    : "Weighing"}{" "}
                  Form
                </h2>
                {eventTypeToEdit === "workout-session" ? (
                  <WorkoutSessionForm onSuccess={closeForm} />
                ) : (
                  <WeighingForm onSuccess={closeForm} />
                )}
              </div>
            )}
          </div> */}
        </div>
      </aside>
    </>
  );
}
