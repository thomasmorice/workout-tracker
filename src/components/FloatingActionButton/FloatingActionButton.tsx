import { AiOutlinePlus } from "react-icons/ai";

import { useEventStore } from "../../store/EventStore";
import { useWorkoutStore } from "../../store/WorkoutStore";
import Dropdown from "../Dropdown/Dropdown";
import { useRouter } from "next/router";
import { MdMenu } from "react-icons/md";

export default function FloatingActionButton() {
  const { showWorkoutForm } = useWorkoutStore();
  const { addOrEditEvent } = useEventStore();
  const router = useRouter();

  const mainButtons = [
    {
      label: `New session`,
      onClick: () => router.push("/session/create"),
    },
    {
      label: "Create a workout",
      onClick: () => showWorkoutForm("create"),
    },
    {
      label: "Add a weighing",
      onClick: () =>
        addOrEditEvent({
          type: "weighing",
        }),
    },
  ];

  // const multipleSelectionButtons = [
  //   {
  //     label: "Unselect all",
  //     onClick: () => console.log("hello"),
  //   },
  //   {
  //     label: "",
  //     onClick: () => console.log("hello"),
  //   },
  // ];

  return (
    <>
      <div className="">
        <Dropdown
          withBackdrop
          buttons={mainButtons}
          containerClass="dropdown-top divide-y"
        >
          <div className="btn-rounded btn-ghost btn-md btn-circle btn flex items-center justify-center bg-primary text-primary-content">
            <AiOutlinePlus size={16} />
          </div>
        </Dropdown>
      </div>
    </>
  );
}
