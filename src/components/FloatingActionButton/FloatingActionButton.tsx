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
      // addOrEditEvent({
      //   type: "workout-session",
      // }),
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
            {/* {hasSelection() && (
              <div className="absolute -mt-a6 -mr-6 text-xs font-normal ">
                {selectedWorkouts.length}
              </div>
            )} */}
          </div>
        </Dropdown>
        {/* <AnimatePresence>
          {hasSelection() && (
            <motion.button
              initial={{ scale: 0.2 }}
              animate={closeButtonAnimationControls}
              exit={{ scale: 0 }}
              onClick={clearSelectedWorkouts}
              type="button"
              className="absolute -top-5 -right-4"
            >
              <div
                style={
                  {
                    // borderRadius: "0 50% 50% 50%",
                  }
                }
                className="btn-error btn-circle flex h-7 w-7 items-center justify-center"
              >
                <MdClose className="" size={13} />
              </div>
            </motion.button>
          )}
        </AnimatePresence> */}
      </div>
    </>
  );
}
