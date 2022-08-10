import { BiLoader } from "react-icons/bi";
import { MdInfo, MdCheck, MdError } from "react-icons/md";
import { useToastStore } from "../../store/ToastStore";

export default function ToastMessage() {
  const { messages } = useToastStore();
  return (
    <div
      className={`toast toast-end toast-top ${
        messages.length > 0 ? "z-[9999]" : "-z-50"
      }`}
    >
      {messages.map((toast) => (
        <div key={toast.id} className={`alert alert-${toast.type} max-w-xs`}>
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-3">
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
        </div>
      ))}
    </div>
  );
}
