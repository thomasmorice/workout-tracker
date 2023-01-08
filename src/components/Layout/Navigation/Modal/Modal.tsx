import { useCallback, useEffect, useRef, useState } from "react";
import { useOnClickOutside, useLockedBody } from "usehooks-ts";
import { Dialog } from "@headlessui/react";
import Drawer from "react-drag-drawer";
interface ModalProps {
  onClose: () => void;
  isOpen: boolean;
  modalChildrenOrder?: number;
  withCloseButton?: boolean;
  children: React.ReactElement;
}

export default function Modal({
  onClose,
  isOpen,
  withCloseButton = false,
  modalChildrenOrder,
  children,
}: ModalProps) {
  const ref = useRef(null);
  useLockedBody(isOpen);

  useOnClickOutside(ref, onClose);

  const onGoBack = useCallback(() => {
    onClose();
    history.forward();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("popstate", onGoBack);
    } else {
      window.removeEventListener("popstate", onGoBack);
    }
  }, [isOpen, onGoBack]);

  return (
    <Drawer
      open={isOpen}
      containerElementClass={"modal-container"}
      modalElementClass={"inner-modal"}
      onRequestClose={onClose}
    >
      <div className="flex w-full items-center justify-center">
        <div className="mb-4 -mt-2 h-0.5 w-28 rounded-sm bg-base-content"></div>
      </div>
      {children}
    </Drawer>
  );
}
