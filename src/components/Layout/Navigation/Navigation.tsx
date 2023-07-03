import { IconType } from "react-icons/lib";
import { MdOutlineSchedule, MdHome, MdSettings } from "react-icons/md";
import MobileBottomNavbar from "./MobileBottomNavbar";
import DesktopSidebar from "./DesktopSidebar";
import { AnimatePresence } from "framer-motion";
import { AiOutlinePlus } from "react-icons/ai";
import { GiGymBag } from "react-icons/gi";

export interface NavigationItemsProps {
  items: {
    icon: IconType;
    label: string;
    href: string;
    isFloatingActionButton?: boolean;
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
      icon: GiGymBag,
      label: "Workouts",
      href: "/this-week-at-my-box",
    },
    {
      icon: AiOutlinePlus,
      label: "",
      href: "",
      isFloatingActionButton: true,
    },
    {
      icon: MdOutlineSchedule,
      label: "Activities",
      href: "/activities",
    },
  ];

  return (
    <>
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
