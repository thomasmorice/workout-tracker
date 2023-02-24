import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { usePreventScroll } from "react-aria";
import { MdArrowBackIosNew } from "react-icons/md";

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
  const innerModal = useRef(null);
  useOnClickOutside(innerModal, onClose);
  usePreventScroll({
    isDisabled: !isOpen,
  });
  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`modal modal-open modal-bottom sm:modal-middle`}>
          <motion.div
            className="w-full"
            transition={{
              duration: 0.2,
            }}
            initial={{
              y: "100%",
            }}
            animate={{
              y: 0,
            }}
            exit={{
              y: "100%",
            }}
          >
            <div ref={innerModal} className="modal-box overflow-y-scroll">
              {title && (
                <div className="text-xl font-bold capitalize">{title}</div>
              )}
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
