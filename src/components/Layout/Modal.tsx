import { useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";

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

  useEffect(() => set_isMounted(true), []);

  useOnClickOutside(ref, onClose);

  return (
    <>
      <div
        className={`modal modal-bottom bg-black bg-opacity-60 duration-[0] sm:modal-middle ${
          isMounted ? "modal-open" : ""
        }`}
      >
        <div
          ref={ref}
          className="max-h-4/5 modal-box w-full bg-base-200 sm:max-h-[calc(100vh_-_5rem)] sm:w-[580px] sm:max-w-5xl"
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
