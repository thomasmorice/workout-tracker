import { useCallback, useEffect, useRef } from "react";
import { useOnClickOutside, useLockedBody } from "usehooks-ts";
import Drawer from "react-drag-drawer";
import { MdClose } from "react-icons/md";
interface ModalProps {
  onClose: () => void;
  isOpen: boolean;
  modalChildrenOrder?: number;
  withCloseButton?: boolean;
  children: React.ReactNode;
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
      allowClose={!withCloseButton}
      containerElementClass={"modal-container"}
      modalElementClass={"inner-modal"}
      onRequestClose={onClose}
    >
      {!withCloseButton ? (
        <div className="flex w-full items-center justify-center">
          <div className="mb-4 -mt-2 h-0.5 w-28 rounded-sm bg-base-content"></div>
        </div>
      ) : (
        <div className="flex w-full items-center justify-end">
          <div onClick={onClose} className="btn btn-circle">
            <MdClose size={16} />{" "}
          </div>
        </div>
      )}
      {children}
    </Drawer>
  );
}
