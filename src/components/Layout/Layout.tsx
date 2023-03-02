import { signIn, signOut, useSession } from "next-auth/react";
import { useWorkoutStore } from "../../store/WorkoutStore";
import WorkoutForm from "../Workout/WorkoutForm";
import Navigation from "./Navigation/Navigation";
import ToastMessage from "./ToastMessage";
import { useRouter } from "next/router";
import { MdLogin } from "react-icons/md";
import { useEffect, useState } from "react";
import RightSidebar from "../RightSidebar/RightSidebar";
import Head from "next/head";
import FloatingActionButton from "../FloatingActionButton/FloatingActionButton";
import WorkoutSelectionBanner from "./WorkoutSelectionBanner";
import WorkoutSessionForm from "../WorkoutSession/WorkoutSessionForm2";
import { useEventStore } from "../../store/EventStore";
import WeighingForm from "../Weighing/WeighingForm2";
import Modal from "./Modal/Modal";
interface LayoutProps {
  children: React.ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { status } = useSession();
  const [currentPath, set_currentPath] = useState<String[]>();
  const { isWorkoutSelectionModeActive } = useWorkoutStore();
  const { showFormWithEventType, closeForm } = useEventStore();

  useEffect(() => {
    const asPathWithoutQuery = router.pathname.split("?")[0];
    set_currentPath(asPathWithoutQuery?.split("/").filter((v) => v.length > 0));
  }, [router.pathname]);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="initial-scale=1, user-scalable=no, width=device-width, height=device-height, viewport-fit=cover"
        />
      </Head>
      <div>
        <ToastMessage />

        <div className="navigation-and-workout-selections relative z-50">
          {isWorkoutSelectionModeActive ? (
            <WorkoutSelectionBanner />
          ) : (
            <Navigation />
          )}
        </div>

        {status === "authenticated" && (
          <>
            <div className="hidden md:block">
              <RightSidebar />
            </div>
            <WorkoutForm />
            <Modal onClose={closeForm} isOpen={!!showFormWithEventType}>
              {showFormWithEventType === "workout-session" ? (
                <WorkoutSessionForm onSuccess={closeForm} />
              ) : (
                <WeighingForm onSuccess={closeForm} />
              )}
            </Modal>

            {!isWorkoutSelectionModeActive && <FloatingActionButton />}
          </>
        )}
        <div id="portal" />

        <main
          className={`px-4 pb-24 sm:px-8 md:ml-16 md:pb-0 xl:ml-24
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
                className="btn-primary btn flex gap-x-2"
              >
                <MdLogin size="22px" />
                Login
              </button>
            )}
          </div>

          {children}
        </main>
      </div>
    </>
  );
}
