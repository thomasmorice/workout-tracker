import { AiOutlinePlus } from "react-icons/ai";
import { useState } from "react";
import Modal from "../Layout/Modal/Modal";
import { useEventStore } from "../../store/EventStore";
import WeighingForm from "../Weighing/WeighingForm";
import { useWorkoutStore } from "../../store/WorkoutStore";
import Dropdown from "../Dropdown/Dropdown";
import { useAnimationControls } from "framer-motion";

export default function FloatingActionButton() {
  const { showWorkoutForm } = useWorkoutStore();
  const { addOrEditEvent } = useEventStore();

  const mainButtons = [
    {
      label: `Create a session`,
      onClick: () =>
        addOrEditEvent({
          type: "workout-session",
        }),
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
      <div className="fixed bottom-20 right-8 z-50">
        <Dropdown
          withBackdrop
          buttons={mainButtons}
          containerClass="dropdown-top dropdown-left divide-y shadow-lg "
        >
          <div className="btn-rounded btn btn-primary btn-circle flex h-16 w-16 items-center justify-center shadow-xl">
            <AiOutlinePlus size={17} />
            {/* {hasSelection() && (
              <div className="absolute -mt-6 -mr-6 text-xs font-normal ">
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
