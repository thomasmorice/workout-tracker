import { signIn, signOut, useSession } from "next-auth/react";
import { useWorkoutStore } from "../../store/WorkoutStore";
import WorkoutForm from "../Workout/WorkoutForm";
import ToastMessage from "./ToastMessage";
import { useRouter } from "next/router";
import { MdLogin } from "react-icons/md";
import { useEffect, useState } from "react";
import RightSidebar from "../RightSidebar/RightSidebar";
import Head from "next/head";
import FloatingActionButton from "../FloatingActionButton/FloatingActionButton";
import WorkoutSelectionBanner from "./WorkoutSelectionBanner";
import WorkoutSessionForm from "../WorkoutSession/WorkoutSessionForm";
import { useEventStore } from "../../store/EventStore";
import WeighingForm from "../Weighing/WeighingForm";
import Modal from "./Modal/Modal";
import { AnimatePresence, motion } from "framer-motion";
import WorkoutAndResults from "../Workout/WorkoutAndResults";
import MainDrawer from "./Navigation/MainDrawer";
import Header from "./Header";
import MobileBottomNavbar from "./Navigation/MobileBottomNavbar";
import Navigation from "./Navigation/Navigation";

interface LayoutProps {
  children: React.ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { status } = useSession();
  const [currentPath, set_currentPath] = useState<String[]>();
  const { isWorkoutSelectionModeActive } = useWorkoutStore();
  const { showFormWithEventType, closeForm } = useEventStore();
  // const [isRoutingToChild, set_isRoutingToChild] = useState(false);

  useEffect(() => {
    const asPathWithoutQuery = router.pathname.split("?")[0];
    set_currentPath(asPathWithoutQuery?.split("/").filter((v) => v.length > 0));
  }, [router.pathname]);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="initial-scale=1; user-scalable=no; width=device-width; height=device-height; viewport-fit=cover"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />

        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </Head>

      <div id="portal"></div>
      {/* <div
        className="absolute top-0 left-0 -z-40 h-40 w-full blur-lg"
        style={{
          background:
            "linear-gradient(180deg, rgba(71,17,187,0.4) 0%, rgba(42,48,60,1) 90%)",
        }}
      ></div> */}
      <div className="antialiased">
        <ToastMessage />
        <AnimatePresence initial={false} mode="sync" key={router.asPath}>
          <div id="header" />
        </AnimatePresence>

        <Header />

        {isWorkoutSelectionModeActive && <WorkoutSelectionBanner />}

        {status === "authenticated" && (
          <>
            <div className="hidden md:block">
              <RightSidebar />
            </div>

            <Navigation />

            {/* Global form */}
            <WorkoutForm />

            <Modal
              noPadding
              onClose={closeForm}
              isOpen={showFormWithEventType === "weighing"}
            >
              <WeighingForm onSuccess={closeForm} />
            </Modal>

            {/* <Modal
              noPadding
              onClose={closeWorkoutDetail}
              isOpen={!!openedWorkoutDetail}
            >
              {openedWorkoutDetail && (
                <WorkoutAndResults workout={openedWorkoutDetail} />
              )}
            </Modal> */}
          </>
        )}

        <main
          className={`overflow-x-hidden px-4 pb-24 sm:px-8 md:ml-16 md:pb-0 xl:ml-24
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
