import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { RiDashboardLine } from "react-icons/ri";
import { CgGym } from "react-icons/cg";
import { IoCalendarOutline } from "react-icons/io5";
import AvatarButton from "../../AvatarButton/AvatarButton";
import { useSession } from "next-auth/react";
import { RxAvatar } from "react-icons/rx";
import { useRouter } from "next/router";
import { GiGymBag } from "react-icons/gi";
import { MdClose } from "react-icons/md";

type MainDrawerProps = {
  isOpen?: boolean;
  onClose: () => void;
};

export default function MainDrawer({ onClose }: MainDrawerProps) {
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  const [open, set_open] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      set_open(true);
    }, 0);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const closeDrawer = () => {
    set_open(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const isLinkActive = useMemo(() => {
    return (path: string) => {
      return path === router.pathname;
    };
  }, [router]);

  return (
    <div className={`drawer-mobile drawer fixed inset-0 z-[60]`}>
      <input
        id="my-drawer"
        type="checkbox"
        className="drawer-toggle"
        onChange={closeDrawer}
        checked={open}
      />
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="menu w-80 bg-base-100 p-4">
          <button className="btn-ghost btn-sm btn-circle btn absolute right-4 top-4 z-[9000]">
            <MdClose onClick={closeDrawer} size={21} />
          </button>
          <div className="ml-4 mt-6 text-[24px] font-semibold">Box Tracker</div>
          <li className="mb-4 -mt-3">
            <Link
              onClick={closeDrawer}
              className="flex flex-col items-start gap-0"
              target="_blank"
              href="mailto:t.morice4@gmail.com?subject=Question regarding BoxTrack app"
            >
              <div className="font-extralight">hello@box-tracker.com</div>
            </Link>
          </li>
          <li>
            <Link
              onClick={() => closeDrawer()}
              href="/"
              className={`flex items-center ${
                isLinkActive("/") ? "text-primary" : ""
              }`}
            >
              <RiDashboardLine className="opacity-50" size={28} /> Dashboard
            </Link>
          </li>

          <li>
            <Link
              onClick={() => closeDrawer()}
              href="/workouts"
              className={`flex items-center ${
                isLinkActive("/workouts") ? "text-primary" : ""
              }`}
            >
              <CgGym className="opacity-50" size={28} /> Workout manager
            </Link>
          </li>
          <li>
            <Link
              onClick={() => closeDrawer()}
              href="/this-week-at-my-box"
              className={`flex items-center ${
                isLinkActive("/this-week-at-my-box") ? "text-primary" : ""
              }`}
            >
              <GiGymBag className="opacity-50" size={28} /> This week at my box
            </Link>
          </li>
          <li>
            <Link
              onClick={() => closeDrawer()}
              href="/activities"
              className={`flex items-center ${
                isLinkActive("/activities") ? "text-primary" : ""
              }`}
            >
              <IoCalendarOutline className="opacity-50" size={28} /> Activities
            </Link>
          </li>
          <li>
            <Link
              onClick={() => closeDrawer()}
              href="/profile"
              className={`flex items-center ${
                isLinkActive("/profile") ? "text-primary" : ""
              }`}
            >
              <RxAvatar className="opacity-50" size={28} />
              {sessionData ? "My Profile" : "Login"}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
