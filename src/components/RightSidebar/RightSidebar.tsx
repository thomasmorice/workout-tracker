import { useWorkoutSessionService } from "../../services/useWorkoutSessionService";
import Calendar from "../WorkoutSchedule/Calendar";
import { formatISO, startOfMonth, endOfMonth } from "date-fns";
import { useScheduleStore } from "../../store/ScheduleStore";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import TimelineSession from "../WorkoutSchedule/TimelineSession";
import { MdArrowDropDown } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";

export default function RightSidebar() {
  const { data: sessionData, status } = useSession();
  const { getWorkoutSessions } = useWorkoutSessionService();
  const { currentVisibleDate, set_currentVisibleDate } = useScheduleStore();

  const { data: workoutSessions, isLoading } = getWorkoutSessions({
    dateFilter: {
      gte: formatISO(startOfMonth(currentVisibleDate)),
      lte: formatISO(endOfMonth(currentVisibleDate)),
    },
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,

      transition: {
        staggerChildren: 0.5,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -40 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <>
      <div className="fixed h-full w-full top-0 left-0 z-10 backdrop-blur-[3px]  bg-base-300 bg-opacity-50"></div>
      <aside className="fixed overflow-y-scroll z-20 h-full w-80 bg-base-100 px-5 py-8 shadow-2xl shadow-base-300 right-0">
        <div className="max-w-xs flex flex-col gap-7">
          {sessionData && (
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
          )}
          <div className="">
            <Calendar
              // handleSelectDate={}
              workoutSessions={workoutSessions ?? []}
              isLoading={isLoading}
            />
          </div>
          <div className="divider m-0"></div>
          <div>
            <h2 className="h2 mb-6">Activity</h2>

            <motion.ol variants={container} initial="hidden" animate="show">
              <AnimatePresence>
                {workoutSessions?.map((session) => {
                  return (
                    <motion.li variants={item} key={session.id}>
                      <TimelineSession
                        // isSessionDone={false}

                        session={session}
                      />
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </motion.ol>
          </div>
        </div>
      </aside>
    </>
  );
}
