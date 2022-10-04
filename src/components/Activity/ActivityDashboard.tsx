import { endOfMonth, formatISO, isSameDay, startOfMonth } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { MdAdd } from "react-icons/md";
import { useEventService } from "../../services/useEventService";
import { useActivityStore } from "../../store/ActivityStore";
import { useEventStore } from "../../store/EventStore";
import Calendar from "./Calendar";
import TimelineItem from "./TimelineItem";

export default function ActivityDashboard() {
  const { openWeighingForm, openSessionForm } = useEventStore();
  const { currentMonth } = useActivityStore();

  const { getEvents } = useEventService();

  const { data: events, isLoading } = getEvents({
    dateFilter: {
      gte: formatISO(startOfMonth(currentMonth)),
      lte: formatISO(endOfMonth(currentMonth)),
    },
  });

  const [showSpecificDay, set_showSpecificDay] = useState<Date>();

  const getFilteredEvents = useMemo(() => {
    if (events) {
      if (showSpecificDay) {
        return events.filter((event) =>
          isSameDay(event.eventDate, showSpecificDay)
        );
      }
      return events;
    }
  }, [events, showSpecificDay]);

  const timelineItemVariant = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  const timelineContainerVariant = {
    hidden: { opacity: 1 },
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
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
        <div className="mb-7 flex items-center gap-3">
          <h2 className="h2">Activity</h2>
          <div className="dropdown ">
            <label tabIndex={0} className="btn btn-outline btn-circle btn-sm">
              <MdAdd size={22} />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box w-52 bg-base-200 p-2 text-sm shadow"
            >
              <li>
                <a onClick={() => openSessionForm()}>Add new session</a>
              </li>
              <li>
                <a onClick={() => openWeighingForm()}>Add weighing</a>
              </li>
            </ul>
          </div>
        </div>
        <AnimatePresence>
          {!isLoading && getFilteredEvents && (
            <motion.ol
              className="relative border-l border-accent-content border-opacity-20"
              variants={timelineContainerVariant}
              initial="hidden"
              animate="show"
            >
              {getFilteredEvents.map((event) => {
                return (
                  <AnimatePresence key={event.id}>
                    <motion.li variants={timelineItemVariant}>
                      <TimelineItem event={event} />
                    </motion.li>
                  </AnimatePresence>
                );
              })}
            </motion.ol>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
