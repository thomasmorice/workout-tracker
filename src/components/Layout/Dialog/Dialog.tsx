import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useEffect, useRef } from "react";

type DialogProps = {
  isVisible: boolean;
  onClose: () => void;
  title?: ReactNode;
  children?: ReactNode;
};

export default function Dialog({
  isVisible,
  onClose,
  title,
  children,
}: DialogProps) {
  return (
    <div className={`modal modal-bottom ${isVisible ? "modal-open" : ""}`}>
      <div className="modal-box">
        <>
          <h3 className="text-lg font-bold capitalize">{title}</h3>
          {children}
        </>
      </div>
      <div className="modal-backdrop ">
        <button onClick={onClose}>close</button>
      </div>
    </div>
  );
}
