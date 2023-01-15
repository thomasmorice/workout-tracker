import { AiOutlinePlus } from "react-icons/ai";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import Modal from "../Layout/Navigation/Modal/Modal";
import { useEventStore } from "../../store/EventStore";
import WeighingForm from "../Weighing/WeighingForm";
import WorkoutSessionForm from "../WorkoutSession/WorkoutSessionForm";
import { useWorkoutStore } from "../../store/WorkoutStore";
import Dropdown from "../Dropdown/Dropdown";
import { MdClose } from "react-icons/md";
import { useFloatingActionButtonStore } from "../../store/FloatingActionButtonStore";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";

export default function FloatingActionButton() {
  const { closeForm } = useEventStore();
  const [showAddSessionModal, set_showAddSessionModal] = useState(false);
  const [showAddWeightModal, set_showAddWeightModal] = useState(false);
  const { showWorkoutForm } = useWorkoutStore();
  const { selectedWorkouts, hasSelection, cleanSelectedWorkouts } =
    useFloatingActionButtonStore();
  const closeButtonAnimationControls = useAnimationControls();

  useEffect(() => {
    if (selectedWorkouts.length > 0) {
      closeButtonAnimationControls.start({
        scale: [1, 1.15, 0.9, 1.15, 1],
        transition: { duration: 0.6 },
      });
    }
  }, [selectedWorkouts, closeButtonAnimationControls]);

  const mainButtons = [
    {
      label: `Add a session ${
        selectedWorkouts.length > 0 ? "with selected workouts" : ""
      }`,
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
    {
      label: "",
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
        <AnimatePresence>
          {hasSelection() && (
            <motion.button
              initial={{ scale: 0.2 }}
              animate={closeButtonAnimationControls}
              exit={{ scale: 0 }}
              onClick={cleanSelectedWorkouts}
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
        </AnimatePresence>
      </div>
    </>
  );
}
