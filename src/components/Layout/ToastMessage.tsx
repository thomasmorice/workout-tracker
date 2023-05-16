import { AnimatePresence, motion } from "framer-motion";
import { BiLoader } from "react-icons/bi";
import { MdInfo, MdCheck, MdError, MdClose } from "react-icons/md";
import { useToastStore } from "../../store/ToastStore";

export default function ToastMessage() {
  const { messages, closeMessage } = useToastStore();
  const itemVariants = {
    initial: { y: 100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };
  return (
    <AnimatePresence>
      {messages.length && (
        <motion.div
          className={`fixed left-1 bottom-1 z-[9999] flex w-[calc(100%_-_0.5rem)] flex-col gap-1 py-0 md:bottom-5 md:right-5 md:max-w-fit`}
        >
          {messages.map((toast) => (
            <div key={toast.id}>
              {toast.type === "pending" && (
                <motion.div
                  transition={{
                    duration: 0.2,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-base-100"
                ></motion.div>
              )}
              <motion.div
                drag
                onDragEnd={() => closeMessage(toast.id)}
                variants={itemVariants}
                initial="initial"
                animate="animate"
                exit="initial"
                transition={{
                  type: "spring",
                  damping: 15,
                  mass: 1,
                  stiffness: 300,
                }}
                className={`alert min-w-[180px] items-start rounded-md py-3.5 alert-${
                  toast.type
                } ${toast.type === "pending" ? "alert-info" : ""}`}
              >
                <div className="flex w-full items-center">
                  <div className="flex w-full justify-between">
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

                      <div className="text-sm">{toast.message}</div>
                    </div>
                    <button className="btn-ghost btn-sm btn">
                      <MdClose
                        size={20}
                        onClick={() => closeMessage(toast.id)}
                      />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
