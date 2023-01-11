import { AiOutlinePlus } from "react-icons/ai";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import Modal from "../Layout/Navigation/Modal/Modal";
import { useEventStore } from "../../store/EventStore";
import WeighingForm from "../Weighing/WeighingForm";
import WorkoutSessionForm from "../WorkoutSession/WorkoutSessionForm";
import { useWorkoutStore } from "../../store/WorkoutStore";
import Dropdown from "../Dropdown/Dropdown";
import { MdClose } from "react-icons/md";
import { useFloatingActionButtonStore } from "../../store/FloatingActionButtonStore";
import { AnimatePresence, motion } from "framer-motion";

export default function FloatingActionButton() {
  const { closeForm } = useEventStore();
  const [showAddSessionModal, set_showAddSessionModal] = useState(false);
  const [showAddWeightModal, set_showAddWeightModal] = useState(false);
  const { showWorkoutForm } = useWorkoutStore();
  const { selectedWorkouts, hasSelection, cleanSelectedWorkouts } =
    useFloatingActionButtonStore();

  const mainButtons = [
    {
      label: "Add a session",
      onClick: () => set_showAddSessionModal(true),
    },
    {
      label: "Add a weighing",
      onClick: () => set_showAddWeightModal(true),
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
  ];

  return (
    <>
      <Modal
        isOpen={showAddWeightModal}
        onClose={() => set_showAddWeightModal(false)}
      >
        <>
          <h3 className="text-lg font-bold">Add a weighing</h3>
          <WeighingForm onSuccess={() => set_showAddWeightModal(false)} />
        </>
      </Modal>
      {/* {showAddSessionModal && ( */}
      <Modal
        isOpen={showAddSessionModal}
        withCloseButton={true}
        onClose={() => set_showAddSessionModal(false)}
      >
        <>
          <h3 className="text-lg font-bold">Add a session</h3>
          <WorkoutSessionForm onSuccess={() => console.log("success")} />
        </>
      </Modal>
      {/* )} */}

      <div className="fixed bottom-20 right-8 z-50">
        <Dropdown
          buttons={mainButtons}
          containerClass="dropdown-top dropdown-left divide-y shadow-lg "
        >
          <div className="btn-rounded btn-primary btn-circle btn flex h-16 w-16 items-center justify-center shadow-xl">
            <AiOutlinePlus size={17} />
            {hasSelection() && (
              <div className="absolute -mt-6 -mr-6 text-xs font-normal ">
                {selectedWorkouts.length}
              </div>
            )}
          </div>
        </Dropdown>
        <AnimatePresence exitBeforeEnter>
          {hasSelection() && (
            <motion.button
              initial={{ scale: 0.2 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={cleanSelectedWorkouts}
              type="button"
              className="absolute -top-5"
            >
              <div
                style={{
                  borderRadius: "0 50% 50% 50%",
                }}
                className="btn-error rotate-[265deg] p-2"
              >
                <MdClose className="-rotate-[265deg]" size={12} />
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* <Dropdown
          buttons={multipleSelectionButtons}
          containerClass="dropdown-top dropdown-left divide-y shadow-lg absolute -top-6 left-14"
        >
          <div
            style={{
              borderRadius: "0 50% 50% 50%",
              // border: "3px solid black",
            }}
            className="btn-primary rotate-[265deg] p-2"
          >
            <MdClose className="-rotate-[260deg]" size={12} />
          </div>
          {/* <div className="btn-rounded btn-primary min-h-6 btn-circle btn flex h-7 w-7 items-center justify-center p-0 text-xs font-medium shadow-xl">
            1
          </div> */}
        {/* </Dropdown> */}
      </div>
    </>
  );
}
