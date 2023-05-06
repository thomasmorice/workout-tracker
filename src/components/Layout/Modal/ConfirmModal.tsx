import Modal from "./Modal";

interface ConfirmModalProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  title,
  children,
  isOpen,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <>
        <h3 className="mb-2 text-xl font-bold capitalize">{title}</h3>
        {children}
        <div className="modal-action">
          <label onClick={onConfirm} className="btn-error btn">
            Confirm
          </label>
          <label onClick={onClose} className="btn">
            Cancel
          </label>
        </div>
      </>
    </Modal>
  );
}
