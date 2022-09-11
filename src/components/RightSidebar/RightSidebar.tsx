import { useWorkoutSessionService } from "../../services/useWorkoutSessionService";
import Calendar from "../WorkoutSchedule/Calendar";
import { formatISO, startOfMonth, endOfMonth, isSameDay } from "date-fns";
import { useScheduleStore } from "../../store/ScheduleStore";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import TimelineSession from "../WorkoutSchedule/TimelineSession";
import {
  MdArrowDropDown,
  MdNotifications,
  MdAdd,
  MdOutlineKeyboardBackspace,
  MdClose,
} from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import WorkoutSessionForm from "../WorkoutSession/WorkoutSessionForm/WorkoutSessionForm";
import { useMemo, useState, useRef } from "react";
import { useOnClickOutside, useLockedBody } from "usehooks-ts";

export default function RightSidebar({ onClose }: { onClose: () => void }) {
  const { data: sessionData, status } = useSession();
  const { getWorkoutSessions } = useWorkoutSessionService();
  const {
    currentVisibleDate,
    selectedSession,
    createSession,
    closeSessionForm,
  } = useScheduleStore();

  const { data: workoutSessions, isLoading } = getWorkoutSessions({
    dateFilter: {
      gte: formatISO(startOfMonth(currentVisibleDate)),
      lte: formatISO(endOfMonth(currentVisibleDate)),
    },
  });

  const [showSpecificDay, set_showSpecificDay] = useState<Date>();

  const timelineContainerVariant = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,

      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const timelineItemVariant = {
    hidden: { opacity: 0, x: 80 },
    show: { opacity: 1, x: 0 },
  };

  const containerVariant = {
    hidden: { x: "100%" },
    show: { x: 0 },
  };

  const workoutSessionsFiltered = useMemo(() => {
    if (workoutSessions?.length ?? 0 > 0) {
      let tempSessions = workoutSessions;
      if (showSpecificDay && tempSessions) {
        tempSessions = [
          ...tempSessions.filter((session) =>
            isSameDay(session.date, showSpecificDay)
          ),
        ];
      }
      return tempSessions;
    }
    return null;
  }, [workoutSessions, showSpecificDay]);

  const containerRef = useRef(null);
  useOnClickOutside(containerRef, onClose);

  useLockedBody(true);

  return (
    <>
      <div className="fixed h-full w-full top-0 left-0 z-20 backdrop-blur-[3px]  bg-base-300 bg-opacity-50"></div>
      <motion.aside
        ref={containerRef}
        initial="hidden"
        animate="show"
        variants={containerVariant}
        className="fixed  overflow-y-scroll z-20  h-[calc(100%_-_3rem)] md:h-full w-full sm:w-96 bg-base-100 px-4 py-8 shadow-2xl shadow-base-300 right-0"
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
            {!selectedSession ? (
              <>
                <Calendar
                  handleSelectDate={(date) => set_showSpecificDay(date)}
                  handleResetSelectDate={() => set_showSpecificDay(undefined)}
                  workoutSessions={workoutSessions ?? []}
                  isLoading={isLoading}
                />

                <div className="divider m-0"></div>
                <div>
                  <div className="flex gap-3 items-center mb-7">
                    <h2 className="h2">Activity</h2>
                    <div className="dropdown ">
                      <label
                        tabIndex={0}
                        className="btn btn-sm btn-outline btn-circle"
                      >
                        <MdAdd size={22} />
                      </label>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52 text-sm"
                      >
                        <li>
                          <a onClick={createSession}>Add new session</a>
                        </li>
                        <li>
                          <a>Other</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <AnimatePresence>
                    {!isLoading && workoutSessionsFiltered && (
                      <motion.ol
                        className="relative border-l border-accent-content border-opacity-20"
                        variants={timelineContainerVariant}
                        initial="hidden"
                        animate="show"
                      >
                        {workoutSessionsFiltered.map((session) => {
                          if (
                            (showSpecificDay &&
                              isSameDay(session.date, showSpecificDay)) ||
                            !showSpecificDay
                          ) {
                            return (
                              <AnimatePresence key={session.id}>
                                <motion.li variants={timelineItemVariant}>
                                  <TimelineSession session={session} />
                                </motion.li>
                              </AnimatePresence>
                            );
                          }
                        })}
                      </motion.ol>
                    )}
                  </AnimatePresence>
                </div>
              </>
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
                  Session Details
                </h2>
                <WorkoutSessionForm
                  onSuccess={closeSessionForm}
                  existingWorkoutSession={
                    selectedSession !== -1 ? selectedSession : undefined
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </>
  );
}
