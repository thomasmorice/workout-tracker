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
        <div className="absolute w-full h-full top-0 left-0 backdrop-blur-[3px] bg-opacity-20 z-30 bg-black"></div>
        <div
          ref={ref}
          className="relative max-h-[85%] modal-box w-full bg-base-200 sm:max-h-[calc(100vh_-_5rem)] sm:w-[580px] sm:max-w-5xl z-[50]"
        >
          {withCloseButton && (
            <label
              onClick={onClose}
              className="btn btn-circle btn-sm absolute right-2 top-2"
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
