import Portal from "../../../Portal/Portal";
import Modal from "./Modal";

interface ConfirmModalProps {
  title: string;
  children: React.ReactElement;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  title,
  children,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  return (
    <Portal>
      <Modal onClose={onClose}>
        <>
          <h3 className="text-xl font-bold capitalize mb-2">{title}</h3>
          {children}
          <div className="modal-action">
            <label onClick={onConfirm} className="btn btn-error">
              Confirm
            </label>
            <label onClick={onClose} className="btn">
              Cancel
            </label>
          </div>
        </>
      </Modal>
    </Portal>
  );
}
