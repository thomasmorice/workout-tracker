import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useWorkoutStore } from "../../store/WorkoutStore";
import WorkoutForm from "../Workout/WorkoutForm";
import Logo from "./Logo";
import Navigation from "./Navigation/Navigation";
import ToastMessage from "./ToastMessage";
import { Rings } from "react-loading-icons";
import { useRouter } from "next/router";
import {
  MdLogin,
  MdMenuOpen,
  MdOutlineKeyboardBackspace,
} from "react-icons/md";
import { useEffect, useMemo, useState } from "react";
import RightSidebar from "../RightSidebar/RightSidebar";
import { useSidebarStore } from "../../store/SidebarStore";
import AvatarButton from "../AvatarButton/AvatarButton";
import { useEventStore } from "../../store/EventStore";

interface LayoutProps {
  children: React.ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  const { state: workoutFormState } = useWorkoutStore();
  const [currentPath, set_currentPath] = useState<String[]>();
  const { eventTypeToEdit, closeForm, eventBeingEdited } = useEventStore();

  const { isSidebarExpanded } = useSidebarStore();

  useEffect(() => {
    const asPathWithoutQuery = router.pathname.split("?")[0];
    set_currentPath(asPathWithoutQuery?.split("/").filter((v) => v.length > 0));
  }, [router.pathname]);

  const getMobileBreadcrumb = useMemo(() => {
    if (status === "unauthenticated") {
      return <>Workout tracker</>;
    } else if (status === "loading" || !currentPath) {
      return <Rings />;
    } else if (!currentPath.length) {
      return <>Dashboard</>;
    } else if (currentPath.includes("workouts")) {
      return <>Workouts</>;
    } else if (currentPath.includes("profile")) {
      return <>My profile</>;
    } else if (currentPath.includes("activities")) {
      if (!eventTypeToEdit) {
        return <>Activities</>;
      } else {
        return (
          <div onClick={closeForm} className="flex items-center gap-2 text-lg">
            <MdOutlineKeyboardBackspace className="h-8 w-8" />{" "}
            {eventTypeToEdit === "workout-session"
              ? "Workout session"
              : "Weighing"}
          </div>
        );
      }
    }
  }, [currentPath, eventTypeToEdit, closeForm, status]);

  return (
    <div>
      <ToastMessage />
      <Navigation />
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
        <div className="hidden items-center justify-between py-6 md:flex">
          <div className="breadcrumbs  text-sm ">
            <ul>
              <li className="capitalize" key={"home"}>
                Home
              </li>
              {currentPath?.map((path, index) => (
                <li className="" key={index}>
                  <a className="capitalize">{path}</a>
                </li>
              ))}
            </ul>
          </div>
          {status === "unauthenticated" && (
            <button
              type="button"
              onClick={() => signIn()}
              className="btn btn-primary flex gap-x-2"
            >
              <MdLogin size="22px" />
              Login
            </button>
          )}
        </div>

        <div className=" mb-4 h-20 md:hidden">
          <div className="fixed inset-x-0 z-50 flex w-full items-center justify-between bg-base-100 py-0 px-4 pr-2 shadow-lg">
            <h1 className="h1 mobile">{getMobileBreadcrumb}</h1>
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
                  <AvatarButton />
                )}
              </>
            )}
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
