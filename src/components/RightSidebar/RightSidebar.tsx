import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  MdArrowDropDown,
  MdNotifications,
  MdOutlineKeyboardBackspace,
} from "react-icons/md";
import WorkoutSessionForm from "../WorkoutSession/WorkoutSessionForm";
import ActivityDashboard from "../Activity/ActivityDashboard";
import WeighingForm from "../Weighing/WeighingForm";
import { useEventStore } from "../../store/EventStore";

export default function RightSidebar() {
  const { data: sessionData, status } = useSession();

  const { eventFormState, closeForm } = useEventStore();

  return (
    <>
      <aside
        className={`sidebar-shadow fixed bottom-0 right-0 z-30 h-full w-80 overflow-y-scroll px-7  py-8 md:h-full`}
      >
        <div className="mx-auto flex max-w-xs flex-col">
          {sessionData && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div className="relative mr-2 h-12 w-12 rounded-full ring ring-base-200">
                  <Image
                    className="rounded-full"
                    layout="fill"
                    referrerPolicy="no-referrer"
                    src={sessionData.user?.image ?? "https://i.pravatar.cc/300"}
                    alt=""
                  />
                </div>
                <h4 className="max-w-[130px] truncate text-lg font-semibold text-accent-content">
                  {sessionData.user?.name}
                </h4>
                <MdArrowDropDown size={22} />
              </div>
              <div>
                <button type="button" className="btn btn-ghost btn-circle">
                  <MdNotifications size="24" />
                </button>
              </div>
            </div>
          )}

          {!eventFormState ? (
            <div className="mt-6">
              <ActivityDashboard />
            </div>
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
                {eventFormState.includes("session") ? "Session" : "Weighing"}{" "}
                Form
              </h2>
              {eventFormState.includes("session") ? (
                <WorkoutSessionForm onSuccess={closeForm} />
              ) : (
                <WeighingForm onSuccess={closeForm} />
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
