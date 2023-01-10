import { AiOutlinePlus } from "react-icons/ai";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import Modal from "../Layout/Navigation/Modal/Modal";
import { useEventStore } from "../../store/EventStore";
import WeighingForm from "../Weighing/WeighingForm";
import WorkoutSessionForm from "../WorkoutSession/WorkoutSessionForm";
import { useWorkoutStore } from "../../store/WorkoutStore";
import Dropdown from "../Dropdown/Dropdown";

export default function FloatingActionButton() {
  const { closeForm } = useEventStore();
  const [showAddSessionModal, set_showAddSessionModal] = useState(false);
  const [showAddWeightModal, set_showAddWeightModal] = useState(false);
  const { showWorkoutForm } = useWorkoutStore();

  const buttons = [
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

      <Dropdown
        buttons={buttons}
        containerClass="dropdown-top dropdown-left fixed bottom-20 right-8 divide-y  shadow-lg"
      >
        <div className="btn-rounded btn-primary btn-circle btn flex h-16 w-16 items-center justify-center shadow-xl">
          <AiOutlinePlus size={16} />
        </div>
      </Dropdown>
    </>
  );
}
