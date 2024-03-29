import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";

type DropdownProps = {
  containerClass?: string;
  children: React.ReactNode;
  withBackdrop?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  buttons: {
    label: ReactNode;
    onClick?: () => void;
  }[];
};

export default function Dropdown({
  containerClass,
  children,
  onOpen,
  onClose,
  buttons,
  withBackdrop = false,
}: DropdownProps) {
  const dropdownRef = useRef(null);
  const [isOpen, set_isOpen] = useState(false);
  useOnClickOutside(dropdownRef, () => set_isOpen(false));

  return (
    <>
      <AnimatePresence>
        {withBackdrop && isOpen && (
          <motion.div
            transition={{
              duration: 0.2,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99] bg-base-100 bg-opacity-80"
          ></motion.div>
        )}
      </AnimatePresence>

      <div
        ref={dropdownRef}
        className={`dropdown  ${containerClass} ${
          isOpen ? "dropdown-open z-[100]" : ""
        } `}
      >
        <button
          onClick={() => {
            set_isOpen(true);
            onOpen && onOpen();
          }}
          type="button"
        >
          {children}
        </button>
        <ul className="dropdown-content menu rounded-box menu-compact absolute w-56 gap-1 border-t-transparent bg-base-300 p-2 text-sm">
          {buttons.map((button, index) => {
            if (button.onClick) {
              return (
                <li key={index}>
                  <a
                    onClick={() => {
                      set_isOpen(false);
                      onClose && onClose();
                      button.onClick && button.onClick();
                    }}
                    className={`group flex w-full items-center rounded-md text-sm text-base-content`}
                  >
                    {button.label}
                  </a>
                </li>
              );
            } else {
              return (
                <li key={index} className="menu-title">
                  <span>{button.label}</span>
                </li>
              );
            }
          })}
        </ul>
      </div>
    </>
  );
}
