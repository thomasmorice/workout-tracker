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
              <button type="button" className="btn btn-ghost btn-circle">
                <MdNotifications size="24" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
