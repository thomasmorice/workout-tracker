import { useEffect, useRef, useState } from "react";
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
  // const [isMounted, set_isMounted] = useState(false);

  const ref = useRef(null);

  useLockedBody(isOpen);

  // useEffect(() => set_isMounted(true), []);

  useOnClickOutside(ref, onClose);

  return (
    <Drawer
      open={isOpen}
      containerElementClass={"modal-container"}
      modalElementClass={"inner-modal"}
      onRequestClose={onClose}
      // className={`modal modal-bottom duration-[0] sm:modal-middle ${
      //   isMounted ? "modal-open" : ""
      // }
      //     ${
      //       !modalChildrenOrder
      //         ? "z-50"
      //         : modalChildrenOrder === 1
      //         ? "z-[60]"
      //         : "z-[70]"
      //     }
      //     `}
    >
      {/* <div
        id="modal-bg"
        className={`fixed top-0 bottom-0 left-0 z-50 h-full w-full bg-black bg-opacity-20 backdrop-blur-[3px] `}
      ></div> */}
      {/* <div
        ref={withCloseButton ? null : ref}
        className={`
          `}
      >
        {withCloseButton && (
          <label
            onClick={onClose}
            className="btn-sm btn-circle btn absolute right-2 top-2"
          >
            ✕
          </label>
        )} */}
      {/* <div className={"h-full "}> */}
      {children}
      {/* </div> */}
      {/* </div> */}
    </Drawer>
  );
}
