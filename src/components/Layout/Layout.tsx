import { signIn, signOut, useSession } from "next-auth/react";
import { useWorkoutFormStore } from "../../store/WorkoutFormStore";
import WorkoutForm from "../Workout/WorkoutForm";
import Logo from "./Logo";
import Navigation from "./Navigation/Navigation";
import Image from "next/image";
import ToastMessage from "./ToastMessage";
import { Rings } from "react-loading-icons";
import { useRouter } from "next/router";
import { MdLogin, MdMenuOpen } from "react-icons/md";
import { useEffect, useState } from "react";
import RightSidebar from "../RightSidebar/RightSidebar";
import { AnimatePresence } from "framer-motion";

interface LayoutProps {
  children: React.ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  const { state: workoutFormState } = useWorkoutFormStore();
  const [currentPath, set_currentPath] = useState<String[]>();
  const [isRightSidebarOpened, set_isRightSidebarOpened] = useState(false);

  useEffect(() => {
    const asPathWithoutQuery = router.pathname.split("?")[0];
    set_currentPath(asPathWithoutQuery?.split("/").filter((v) => v.length > 0));
  }, [router.pathname]);

  return (
    <div>
      <ToastMessage />
      <Navigation onOpenSidebar={() => set_isRightSidebarOpened(true)} />
      <AnimatePresence>
        {isRightSidebarOpened && (
          <RightSidebar onClose={() => set_isRightSidebarOpened(false)} />
        )}
      </AnimatePresence>
      {workoutFormState && <WorkoutForm />}
      <div id="portal" />
      {/* {workoutSessionFormState && Workout} */}

      <main className={`px-5 sm:px-8 md:ml-80`}>
        <div className="flex w-full justify-between py-5 items-center">
          <div className="hidden md:block text-sm breadcrumbs">
            <ul>
              <li className="capitalize" key={"home"}>
                Home
              </li>
              {currentPath?.map((path, index) => (
                <li key={index}>
                  <a className="capitalize">{path}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:hidden">
            <Logo />
          </div>
          {status === "loading" ? (
            <>
              <div className="flex items-center gap-x-2">
                <Rings className="text-xl" />
              </div>
            </>
          ) : (
            <>
              {sessionData ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => set_isRightSidebarOpened(true)}
                    type="button"
                    className="btn btn-ghost flex gap-2"
                  >
                    <MdMenuOpen size={24} />
                    <div className="hidden md:flex">Activities</div>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => signIn()}
                  className="btn btn-ghost flex gap-x-2"
                >
                  <MdLogin size="22px" />
                  Login
                </button>
              )}
            </>
          )}
        </div>
        {children}
      </main>
    </div>
  );
}
