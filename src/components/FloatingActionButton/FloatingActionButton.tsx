import { AiOutlinePlus } from "react-icons/ai";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import Modal from "../Layout/Navigation/Modal/Modal";
import { useEventStore } from "../../store/EventStore";
import WeighingForm from "../Weighing/WeighingForm";
import WorkoutSessionForm from "../WorkoutSession/WorkoutSessionForm";
import { useWorkoutStore } from "../../store/WorkoutStore";

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

      <div className="dropdown dropdown-top dropdown-left menu fixed bottom-20 right-8 z-40 divide-y  shadow-lg">
        <Menu as="div" className="">
          <Menu.Button className="btn-rounded btn-primary btn-circle btn flex h-16 w-16 items-center justify-center shadow-xl">
            <AiOutlinePlus size={16} />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-50"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-50"
          >
            <div className="">
              <Menu.Items
                as={"ul"}
                className="dropdown-content menu rounded-box w-52 gap-1 bg-base-200 p-2 text-sm shadow-lg"
              >
                {buttons.map((button) => (
                  <Menu.Item as={"li"} key={button.label}>
                    {({ active }) => (
                      <button
                        onClick={button.onClick}
                        className={`${
                          active ? "bg-primary" : ""
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm text-base-content`}
                      >
                        {button.label}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </div>
          </Transition>
        </Menu>
      </div>
    </>
  );
}
