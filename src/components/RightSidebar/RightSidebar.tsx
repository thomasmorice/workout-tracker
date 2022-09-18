import { useSidebarStore } from "../../store/SidebarStore";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  MdArrowDropDown,
  MdNotifications,
  MdOutlineKeyboardBackspace,
  MdClose,
} from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import WorkoutSessionForm from "../WorkoutSession/WorkoutSessionForm";
import { useRef } from "react";
import { useOnClickOutside, useLockedBody } from "usehooks-ts";
import { useEventService } from "../../services/useEventService";
import ActivityDashboard from "../Activity/ActivityDashboard";
import WeighingForm from "../Weighing/WeighingForm";

export default function RightSidebar({ onClose }: { onClose: () => void }) {
  const { data: sessionData, status } = useSession();
  const { getEvents } = useEventService();

  const {
    currentVisibleDate,
    selectedSession,
    closeSessionForm,
    isSidebarLocked,
    selectedWeighing,
  } = useSidebarStore();

  const timelineItemVariant = {
    hidden: { opacity: 0, x: 80 },
    show: { opacity: 1, x: 0 },
  };

  const containerVariant = {
    hidden: { x: "100%" },
    show: { x: 0 },
  };

  const containerRef = useRef(null);
  useOnClickOutside(containerRef, (e) => {
    !isSidebarLocked && onClose();
  });

  useLockedBody(true);

  return (
    <>
      <div className="fixed h-full w-full top-0 left-0 z-20 backdrop-blur-[3px]  bg-base-300 bg-opacity-50"></div>
      <motion.aside
        ref={containerRef}
        initial="hidden"
        animate="show"
        variants={containerVariant}
        className={`fixed bottom-0 z-30 h-full md:h-full w-full sm:w-96 bg-base-100 px-4 py-8 shadow-2xl shadow-base-300 right-0
         ${isSidebarLocked ? "" : "overflow-y-scroll"} `}
      >
        <div className="max-w-xs flex flex-col gap-7 mx-auto">
          {sessionData && (
            <div className="flex justify-between items-center">
              <div className="flex gap-1 items-center">
                <div className="w-12 h-12 relative rounded-full ring ring-base-200 mr-2">
                  <Image
                    className="rounded-full"
                    layout="fill"
                    referrerPolicy="no-referrer"
                    src={sessionData.user?.image ?? "https://i.pravatar.cc/300"}
                    alt=""
                  />
                </div>
                <h4 className="text-lg font-semibold text-accent-content">
                  {sessionData.user?.name}
                </h4>
                <MdArrowDropDown size={22} />
              </div>
              <div>
                <button type="button" className="btn btn-ghost btn-circle">
                  <MdNotifications size="24" />
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-circle sm:hidden"
                  onClick={onClose}
                >
                  <MdClose size="24" />
                </button>
              </div>
            </div>
          )}

          <AnimatePresence>
            {!selectedSession && !selectedWeighing ? (
              <ActivityDashboard />
            ) : (
              <motion.div
                variants={timelineItemVariant}
                initial="hidden"
                animate="show"
              >
                <h2
                  onClick={closeSessionForm}
                  className="h2 flex gap-3 items-center group cursor-pointer"
                >
                  <MdOutlineKeyboardBackspace
                    className="group-hover:-translate-x-1 transition-transform"
                    size={16}
                  />
                  {selectedSession ? "Session" : "Weighing"} Form
                </h2>
                {selectedSession ? (
                  <WorkoutSessionForm
                    onSuccess={closeSessionForm}
                    existingWorkoutSession={
                      selectedSession !== -1 ? selectedSession : undefined
                    }
                  />
                ) : (
                  <WeighingForm onSuccess={closeSessionForm} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </>
  );
}
