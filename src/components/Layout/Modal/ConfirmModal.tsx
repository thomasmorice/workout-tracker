import Dialog from "../Dialog/Dialog";

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
    <Dialog title={title} isVisible={isOpen} onClose={onClose}>
      <div className="mt-1">
        {children}
        <div className="modal-action">
          <label onClick={onClose} className="btn-neutral btn">
            Cancel
          </label>
          <label onClick={onConfirm} className="btn-primary btn">
            Confirm
          </label>
        </div>
      </div>
    </Dialog>
  );
}
