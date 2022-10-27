import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useWorkoutStore } from "../../store/WorkoutStore";
import WorkoutForm from "../Workout/WorkoutForm";
import Logo from "./Logo";
import Navigation from "./Navigation/Navigation";
import ToastMessage from "./ToastMessage";
import { Rings } from "react-loading-icons";
import { useRouter } from "next/router";
import { MdLogin, MdMenuOpen } from "react-icons/md";
import { useEffect, useState } from "react";
import RightSidebar from "../RightSidebar/RightSidebar";
import { useSidebarStore } from "../../store/SidebarStore";
import AvatarButton from "../AvatarButton/AvatarButton";

interface LayoutProps {
  children: React.ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  const { state: workoutFormState } = useWorkoutStore();
  const [currentPath, set_currentPath] = useState<String[]>();
  const [isRightSidebarOpened, set_isRightSidebarOpened] = useState(false);
  const { isSidebarExpanded } = useSidebarStore();

  useEffect(() => {
    const asPathWithoutQuery = router.pathname.split("?")[0];
    set_currentPath(asPathWithoutQuery?.split("/").filter((v) => v.length > 0));
  }, [router.pathname]);

  return (
    <div>
      <ToastMessage />
      <Navigation onOpenSidebar={() => set_isRightSidebarOpened(true)} />
      {status === "authenticated" && (
        <div className="hidden md:block">
          <RightSidebar />
        </div>
      )}
      {workoutFormState && <WorkoutForm />}
      <div id="portal" />

      <main
        className={`px-5 pb-24 transition-all sm:px-8 md:pb-0 
          ${isSidebarExpanded ? "md:ml-64" : "md:ml-16 xl:ml-20"}
          ${status === "authenticated" ? "md:mr-80 xl:mr-[340px]" : ""}
        `}
      >
        <div className="flex w-full items-center justify-between py-5">
          <div className="breadcrumbs hidden text-sm md:block">
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
              {!sessionData ? (
                <button
                  type="button"
                  onClick={() => signIn()}
                  className="btn btn-primary flex gap-x-2"
                >
                  <MdLogin size="22px" />
                  Login
                </button>
              ) : (
                <div className="md:hidden">
                  <AvatarButton />
                </div>
              )}
            </>
          )}
        </div>
        {children}
      </main>
    </div>
  );
}
