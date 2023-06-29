import { signIn, signOut, useSession } from "next-auth/react";
import { useWorkoutStore } from "../../store/WorkoutStore";
import WorkoutForm from "../Workout/WorkoutForm";
import ToastMessage from "./ToastMessage";
import { useRouter } from "next/router";
import { MdLogin } from "react-icons/md";
import { useEffect, useState } from "react";
import RightSidebar from "../RightSidebar/RightSidebar";
import Head from "next/head";
import WorkoutSelectionBanner from "./WorkoutSelectionBanner";
import { useEventStore } from "../../store/EventStore";
import WeighingForm from "../Weighing/WeighingForm";
import Dialog from "../Layout/Dialog/Dialog";
import Navigation from "./Navigation/Navigation";

interface LayoutProps {
  children: React.ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { status } = useSession();
  const [currentPath, set_currentPath] = useState<String[]>();
  const { showFormWithEventType, closeForm } = useEventStore();
  const {
    state,
    workout: existingWorkout,
    closeWorkoutForm,
    isWorkoutSelectionModeActive,
  } = useWorkoutStore();

  useEffect(() => {
    const asPathWithoutQuery = router.pathname.split("?")[0];
    set_currentPath(asPathWithoutQuery?.split("/").filter((v) => v.length > 0));
  }, [router.pathname]);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="initial-scale=1; maximum-scale=1; width=device-width; viewport-fit=cover"
        />
        <meta name="apple-mobile-web-app-title" content="Box tracker"></meta>
        <meta name="apple-touch-fullscreen" content="yes"></meta>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />

        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </Head>

      <div id="portal"></div>

      <div className="antialiased">
        <ToastMessage />

        {isWorkoutSelectionModeActive && <WorkoutSelectionBanner />}

        {status === "authenticated" && (
          <>
            <div className="hidden md:block">
              <RightSidebar />
            </div>

            <Navigation />

            {/* Global form */}
            <Dialog
              title={state && `${state} a workout`}
              isVisible={!!state}
              onClose={closeWorkoutForm}
            >
              <WorkoutForm />
            </Dialog>

            <Dialog
              title={"Weighing form"}
              onClose={closeForm}
              isVisible={showFormWithEventType === "weighing"}
            >
              <WeighingForm onSuccess={closeForm} />
            </Dialog>
          </>
        )}

        <main
          className={`overflow-x-hidden px-5 pb-24 sm:px-8 md:ml-16 md:pb-0 xl:ml-24
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

          {/* <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={router.asPath}
              initial={isRoutingToChild ? { x: 300 } : { x: 300 }}
              animate={{ x: 0, opacity: 1 }}
              exit={isRoutingToChild ? { x: -300 } : { x: -300 }}
            > */}
          {children}
          {/* </motion.div>
          </AnimatePresence> */}
        </main>
      </div>
    </>
  );
}
