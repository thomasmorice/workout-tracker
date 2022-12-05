import { IconType } from "react-icons/lib";
import {
  MdOutlineSchedule,
  MdHome,
  MdPadding,
  MdOutlineDashboard,
  MdOutlineAccountCircle,
} from "react-icons/md";
import { HiOutlineClipboardList } from "react-icons/hi";
import MobileBottomNavbar from "./MobileBottomNavbar";
import DesktopSidebar from "./DesktopSidebar";

export interface NavigationItemsProps {
  items: {
    icon: IconType;
    label: string;
    href: string;
  }[];
}

export default function Navigation() {
  const NavigationItems: NavigationItemsProps["items"] = [
    {
      icon: MdHome,
      label: "Dashboard",
      href: "/",
    },
    {
      icon: HiOutlineClipboardList,
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
        <MobileBottomNavbar items={NavigationItems} />
      </div>
    </>
  );
}
