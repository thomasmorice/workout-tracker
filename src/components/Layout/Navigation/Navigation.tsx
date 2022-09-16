import { IconType } from "react-icons/lib";
import {
  MdOutlineSchedule,
  MdPadding,
  MdOutlineDashboard,
  MdOutlineAccountCircle,
} from "react-icons/md";
import MobileNavbar from "./MobileNavbar";
import DesktopSidebar from "./DesktopSidebar";

export interface NavigationItemsProps {
  onOpenSidebar?: () => void;
  items: {
    icon: IconType;
    label: string;
    href: string;
  }[];
}

export default function Navigation({
  onOpenSidebar,
}: {
  onOpenSidebar: () => void;
}) {
  const NavigationItems: NavigationItemsProps["items"] = [
    {
      icon: MdOutlineDashboard,
      label: "Dashboard",
      href: "/",
    },
    {
      icon: MdPadding,
      label: "Workouts",
      href: "/workouts",
    },
    // {
    //   icon: MdOutlineSchedule,
    //   label: "Activities",
    //   href: "/schedule",
    // },
    {
      icon: MdOutlineAccountCircle,
      label: "Profile",
      href: "/profile",
    },
  ];

  return (
    <>
      {/* Desktop Nav */}
      <div className="hidden md:block">
        <DesktopSidebar items={NavigationItems} />
      </div>
      {/* Mobile Nav */}
      <div className="block md:hidden">
        <MobileNavbar onOpenSidebar={onOpenSidebar} items={NavigationItems} />
      </div>
    </>
  );
}
