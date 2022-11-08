import { useEffect, useRef, useState } from "react";
import { useOnClickOutside, useLockedBody } from "usehooks-ts";

interface ModalProps {
  onClose: () => void;
  withCloseButton?: boolean;
  children: React.ReactElement;
}

export default function Modal({
  onClose,
  withCloseButton = false,
  children,
}: ModalProps) {
  const [isMounted, set_isMounted] = useState(false);
  const ref = useRef(null);

  useLockedBody(true);

  useEffect(() => set_isMounted(true), []);

  useOnClickOutside(ref, onClose);

  return (
    <>
      <div
        className={`modal modal-bottom  duration-[0] sm:modal-middle ${
          isMounted ? "modal-open" : ""
        }`}
      >
        <div
          id="modal-bg"
          className="fixed top-0 bottom-0 left-0 z-50 h-full w-full bg-black bg-opacity-20 backdrop-blur-[3px]"
        ></div>
        <div
          ref={ref}
          className="modal-box relative z-50 max-h-[85%] w-full sm:max-h-[calc(100vh_-_5rem)] sm:w-[580px] sm:max-w-5xl"
        >
          {withCloseButton && (
            <label
              onClick={onClose}
              className="btn btn-sm btn-circle absolute right-2 top-2"
            >
              ✕
            </label>
          )}
          {children}
        </div>
      </div>
    </>
  );
}
