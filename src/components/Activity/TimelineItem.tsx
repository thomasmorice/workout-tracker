import { useToastStore } from "../../store/ToastStore";
import ConfirmModal from "../Layout/Navigation/Modal/ConfirmModal";
import { useState } from "react";
import { InferQueryOutput } from "../../types/trpc";
import {
  MdOutlineCalendarToday,
  MdTimer,
  MdChecklistRtl,
  MdDelete,
  MdMonitorWeight,
} from "react-icons/md";
import {
  getActivityDate,
  getSessionTitle,
  getSessionTotalTime,
} from "../../utils/utils";
import { format, isBefore } from "date-fns";
import { useEventService } from "../../services/useEventService";
import { useEventStore } from "../../store/EventStore";
import { zonedTimeToUtc } from "date-fns-tz";

interface TimelineSessionProps {
  event: InferQueryOutput<"event.get-events">[number];
}

export default function TimelineItem({ event }: TimelineSessionProps) {
  const { deleteEvent } = useEventService();
  const { addMessage, closeMessage } = useToastStore();
  const [showConfirmDeleteEventModal, set_showConfirmDeleteEventModal] =
    useState(false);

  const { openWeighingForm, openSessionForm } = useEventStore();

  return (
    <>
      <div className="mb-12 ml-5 cursor-pointer">
        <div
          onClick={() => {
            if (event.workoutSession) {
              openSessionForm(event.workoutSession);
            } else {
              openWeighingForm(event.weighing);
            }
          }}
          className="group"
        >
          <div
            className={`absolute -left-1.5 h-3 w-3 rounded-full border border-opacity-10 transition-all
          ${
            isBefore(event.eventDate, Date.now())
              ? "border-accent-content bg-base-300 group-hover:bg-base-100"
              : "border-primary bg-primary"
          }`}
          ></div>
          <div className="flex flex-col gap-2 transition-transform group-hover:translate-x-1">
            <time className="-mt-0.5 flex items-center gap-2 text-sm text-accent-content">
              {format(
                zonedTimeToUtc(event.eventDate, "Europe/Stockholm"),
                "LLLL do, u 'at' p"
              )}
            </time>
            {/* <h3 className="-mt-1.5 flex items-center gap-2 font-semibold text-accent-content">
              {event.workoutSession
                ? getSessionTitle(event.workoutSession)
                : "Weighing"}
            </h3> */}
            <div className=" flex flex-col gap-2 text-xs font-light ">
              <div className="flex items-center gap-1.5">
                {/* <MdOutlineCalendarToday className="opacity-50" size={16} /> */}
                {event.workoutSession
                  ? getSessionTitle(event.workoutSession)
                  : "Weighing"}
              </div>
              {event.workoutSession ? (
                <>
                  <div className="flex items-center gap-1.5 ">
                    <MdTimer className="opacity-50" size={16} />
                    {getSessionTotalTime(event.workoutSession)}mn session
                  </div>

                  <div className="flex items-center gap-1.5">
                    <MdChecklistRtl className="opacity-50" size={16} />
                    {event.workoutSession.workoutResults.length} workout(s)
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-1.5">
                  <MdMonitorWeight className="opacity-50" size={16} />
                  <div className="">{event.weighing?.weight}KG</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={() => set_showConfirmDeleteEventModal(true)}
            type="button"
            className="btn btn-outline btn-error btn-xs w-fit"
          >
            <div className="flex items-center gap-2">
              <MdDelete />
            </div>
          </button>
        </div>
      </div>

      {showConfirmDeleteEventModal && (
        <ConfirmModal
          onConfirm={async () => {
            const message = addMessage({
              type: "pending",
              message: "Deleting...",
            });
            await deleteEvent.mutateAsync({
              id: event.id,
            });
            addMessage({
              type: "success",
              message: "Deleted successfully",
            });
            closeMessage(message);
            set_showConfirmDeleteEventModal(false);
          }}
          onClose={() => set_showConfirmDeleteEventModal(false)}
          title={`Confirm delete ${event.weighing ? "weighing" : "session"}`}
        >
          <p>
            Are you sure you wanna delete this{" "}
            {event.workoutSession
              ? "workout session and all the results associated"
              : "weighing"}{" "}
            ?
          </p>
        </ConfirmModal>
      )}
    </>
  );
}
