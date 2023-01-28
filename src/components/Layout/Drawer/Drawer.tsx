export type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Drawer({ children, isOpen, onClose }: DrawerProps) {
  return (
    <div className="drawer fixed z-[1000]">
      <input
        id="my-drawer"
        type="checkbox"
        checked={isOpen}
        onClick={onClose}
        className="drawer-toggle"
      />
      <div className="drawer-content">
        <label htmlFor="my-drawer" className="btn-primary drawer-button btn">
          Open drawer
        </label>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <div className="max-w-xs bg-base-100 px-3 pt-5">{children}</div>
      </div>
    </div>
  );
}
