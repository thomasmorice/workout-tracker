import { AiOutlinePlus } from "react-icons/ai";

import { useEventStore } from "../../store/EventStore";
import { useWorkoutStore } from "../../store/WorkoutStore";
import Dropdown from "../Dropdown/Dropdown";
import { useRouter } from "next/router";

export default function FloatingActionButton() {
  const { showWorkoutForm } = useWorkoutStore();
  const { addOrEditEvent } = useEventStore();
  const router = useRouter();

  const mainButtons = [
    {
      label: `Create a session`,
      onClick: () => router.push("/session/create"),
    },
    {
      label: "Add a weighing",
      onClick: () =>
        addOrEditEvent({
          type: "weighing",
        }),
    },
    {
      label: "Create a workout",
      onClick: () => showWorkoutForm("create"),
    },
  ];

  const multipleSelectionButtons = [
    {
      label: "Unselect all",
      onClick: () => console.log("hello"),
    },
    {
      label: "",
      onClick: () => console.log("hello"),
    },
  ];

  return (
    <>
      <div className="">
        <Dropdown
          withBackdrop
          buttons={mainButtons}
          containerClass="dropdown-top divide-y"
        >
          <div className="btn-rounded btn-md btn-circle btn flex items-center justify-center">
            <AiOutlinePlus size={16} />
          </div>
        </Dropdown>
      </div>
    </>
  );
}
