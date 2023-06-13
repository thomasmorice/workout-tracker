import { endOfMonth, formatISO, isSameDay, startOfMonth } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { MdAdd } from "react-icons/md";
import { useActivityStore } from "../../store/ActivityStore";
import { useEventStore } from "../../store/EventStore";
import { trpc } from "../../utils/trpc";
import Calendar from "./Calendar";
import TimelineItem from "./TimelineItem";
import { useSession } from "next-auth/react";
import { EventRouterType } from "../../server/trpc/router/event-router";
import { inferRouterOutputs } from "@trpc/server";
import Link from "next/link";
import Dropdown from "../Dropdown/Dropdown";
import { useRouter } from "next/router";

export default function ActivityDashboard() {
  const { addOrEditEvent } = useEventStore();
  const { currentMonth } = useActivityStore();
  const { data: sessionData } = useSession();
  const [filteredEvents, set_filteredEvents] =
    useState<inferRouterOutputs<EventRouterType>["getEvents"]>();

  const router = useRouter();

  const {
    data: events,
    isLoading,
    isRefetching,
  } = trpc.event.getEvents.useQuery(
    {
      dateFilter: {
        gte: formatISO(startOfMonth(currentMonth)),
        lte: formatISO(endOfMonth(currentMonth)),
      },
    },
    { enabled: sessionData?.user !== undefined }
  );

  const [showSpecificDay, set_showSpecificDay] = useState<Date>();

  useEffect(() => {
    let filteredEvents = [];
    if (events) {
      if (showSpecificDay) {
        filteredEvents = events.filter((event) =>
          isSameDay(event.eventDate, showSpecificDay)
        );
      }
      set_filteredEvents(events);
    }
  }, [events, showSpecificDay]);

  const timelineContainerVariant = {
    hidden: {
      opacity: 0,
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const timelineItemVariant = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <>
      <Calendar
        handleSelectDate={(date) => set_showSpecificDay(date)}
        handleResetSelectDate={() => set_showSpecificDay(undefined)}
        workoutSessionEvents={
          events?.filter((event) => event.workoutSession) ?? []
        }
        isLoading={isLoading}
      />

      <div className="divider my-6"></div>
      <div>
        <div className="flex items-center gap-3">
          <h2 className="h2">Activity</h2>
          <Dropdown
            withBackdrop
            buttons={[
              {
                label: "Add new session",
                onClick: () => router.push("/session/create"),
              },
              {
                label: "Add weighing",
                onClick: () =>
                  addOrEditEvent({
                    type: "weighing",
                    date: showSpecificDay,
                  }),
              },
            ]}
            containerClass="dropdown-right "
          >
            <div className={`btn-outline btn-xs btn-circle btn`}>
              <MdAdd size={16} />
            </div>
          </Dropdown>
        </div>
        {showSpecificDay && (
          <h3 className="mt-2">
            {filteredEvents ? (
              <>{filteredEvents.length} session selected</>
            ) : (
              <>No workout on this specific day</>
            )}
          </h3>
        )}
        <div className="mt-7">
          {!isLoading && filteredEvents && (
            <motion.ol
              key={filteredEvents[0]?.id}
              variants={timelineContainerVariant}
              initial="hidden"
              animate="show"
            >
              {filteredEvents.map((event) => {
                return (
                  <motion.li key={event.id} variants={timelineItemVariant}>
                    <TimelineItem event={event} />
                  </motion.li>
                );
              })}
            </motion.ol>
          )}
        </div>
      </div>
    </>
  );
}
