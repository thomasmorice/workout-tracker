import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";

type ModalProps = {
  isOpen: boolean;
  title?: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
};

export default function Modal({
  isOpen,
  title,
  children,
  onClose,
}: ModalProps) {
  const [showModal, set_showModal] = useState<boolean>(false);

  useEffect(() => {
    set_showModal(isOpen);
  }, [isOpen]);

  return (
    <Dialog
      className={`modal modal-bottom sm:modal-middle ${
        showModal ? "modal-open" : ""
      }`}
      open={isOpen}
      onClose={onClose}
    >
      <Dialog.Panel className="modal-box">
        {title && (
          <Dialog.Title className="text-xl font-bold capitalize">
            {title}
          </Dialog.Title>
        )}
        {/* <Dialog.Description>Here yçou c</Dialog.Description> */}
        {children}
      </Dialog.Panel>
    </Dialog>
  );
}
