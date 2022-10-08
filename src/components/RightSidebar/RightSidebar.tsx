import { MdOutlineKeyboardBackspace } from "react-icons/md";
import WorkoutSessionForm from "../WorkoutSession/WorkoutSessionForm";
import ActivityDashboard from "../Activity/ActivityDashboard";
import WeighingForm from "../Weighing/WeighingForm";
import { useEventStore } from "../../store/EventStore";
import AvatarButton from "../AvatarButton/AvatarButton";
import { MdNotifications } from "react-icons/md";

export default function RightSidebar() {
  const { eventFormState, closeForm } = useEventStore();

  return (
    <>
      <aside
        className={`sidebar-shadow fixed bottom-0 right-0 z-30 h-full w-80 overflow-y-scroll px-7  py-8 md:h-full`}
      >
        <div className="mx-auto flex max-w-xs flex-col">
          <div className="flex items-center justify-between">
            <AvatarButton />
            <div>
              <button type="button" className="btn btn-ghost btn-circle">
                <MdNotifications size="24" />
              </button>
            </div>
          </div>

          <div className="mt-6">
            {!eventFormState ? (
              <ActivityDashboard />
            ) : (
              <div>
                <h2
                  onClick={closeForm}
                  className="h2 group  flex cursor-pointer items-center gap-3"
                >
                  <MdOutlineKeyboardBackspace
                    className="transition-transform group-hover:-translate-x-1"
                    size={16}
                  />
                  {eventFormState.includes("session") ? "Session" : "Weighing"}{" "}
                  Form
                </h2>
                {eventFormState.includes("session") ? (
                  <WorkoutSessionForm
                    onSuccess={() => console.log("success")}
                  />
                ) : (
                  <WeighingForm onSuccess={closeForm} />
                )}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
