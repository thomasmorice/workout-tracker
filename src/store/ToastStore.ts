import { v4 as uuid } from "uuid";
import create from "zustand";

export interface ToastMessage {
  id: string;
  type: "info" | "success" | "pending" | "error";
  title?: string;
  message: string;
  closeAfter?: number;
}
export interface ToastProps {
  messages?: ToastMessage[];
}

interface ToastState {
  messages: ToastMessage[];
  addMessage: ({
    message,
    type,
    closeAfter,
  }: Omit<ToastMessage, "id">) => string;
  closeMessage: (id: string) => void;
}

const useToastStore = create<ToastState>()((set, get) => ({
  messages: [],
  addMessage({ title, message, type, closeAfter = 2000 }) {
    if (!title) {
      if (type === "error") {
        title = "Woops!";
      } else if (type === "info") {
        title = "Note";
      } else if (type === "pending") {
        title = "Please hold...";
      } else {
        title = "Success!";
      }
    }

    const id: string = uuid();
    set(({ messages }) => ({
      messages: [
        ...messages,
        {
          id,
          title,
          message,
          type,
        },
      ],
    }));
    if (type !== "pending") {
      setTimeout(() => {
        set(({ messages }) => ({
          messages: messages.filter((msg) => msg.id !== id),
        }));
      }, closeAfter);
    }
    return id;
  },
  closeMessage(id) {
    set(({ messages }) => ({
      messages: messages.filter((msg) => msg.id !== id),
    }));
  },
}));

export { useToastStore };
