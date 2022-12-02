import { AnimatePresence, motion } from "framer-motion";
import { BiLoader } from "react-icons/bi";
import { MdInfo, MdCheck, MdError } from "react-icons/md";
import { useToastStore } from "../../store/ToastStore";

export default function ToastMessage() {
  const { messages, closeMessage } = useToastStore();
  const itemVariants = {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
  };
  return (
    <div
      className={`fixed right-2 bottom-3 flex max-w-fit flex-col gap-1 py-0 md:bottom-5 md:right-5 ${
        messages.length > 0 ? "z-[9999]" : "-z-50"
      }`}
    >
      <AnimatePresence>
        {messages.map((toast) => (
          <motion.div
            drag
            onDragEnd={() => closeMessage(toast.id)}
            key={toast.id}
            variants={itemVariants}
            initial="initial"
            animate="animate"
            transition={{
              type: "spring",
              damping: 15,
              mass: 1,
              stiffness: 300,
            }}
            className={`alert min-w-[180px] items-start alert-${toast.type}`}
          >
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-1.5">
                <div className="flex-1">
                  {toast.type === "info" && <MdInfo size={21} />}
                  {toast.type === "success" && <MdCheck size={21} />}
                  {toast.type === "error" && <MdError size={21} />}
                  {toast.type === "pending" && (
                    <BiLoader className="animate-spin " size={21} />
                  )}
                </div>
                <div className="font-bold">{toast.title}</div>
              </div>
              <div className="text-sm">{toast.message}</div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
