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
import { isBefore } from "date-fns";
import { useEventService } from "../../services/useEventService";
import { useEventStore } from "../../store/EventStore";

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
      <div className="mb-12 ml-4 cursor-pointer">
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
            className={`absolute transition-all w-3 h-3 rounded-full -left-1.5 border border-opacity-10
          ${
            isBefore(event.eventDate, Date.now())
              ? "bg-base-300 border-accent-content group-hover:bg-base-100"
              : "bg-primary border-primary"
          }`}
          ></div>
          <div className="gap-2 flex flex-col group-hover:translate-x-1 transition-transform">
            <h3 className="font-semibold text-accent-content -mt-1.5 flex gap-2 items-center">
              {event.workoutSession
                ? getSessionTitle(event.workoutSession)
                : "Weighing"}
            </h3>
            <div className=" font-light text-xs flex flex-col gap-2 ">
              <div className="flex gap-1.5 items-center">
                <MdOutlineCalendarToday className="opacity-50" size={16} />
                <time className="">{getActivityDate(event)}</time>
              </div>
              {event.workoutSession ? (
                <>
                  <div className="flex gap-1.5 items-center ">
                    <MdTimer className="opacity-50" size={16} />
                    {getSessionTotalTime(event.workoutSession)}mn session
                  </div>

                  <div className="flex gap-1.5 items-center">
                    <MdChecklistRtl className="opacity-50" size={16} />
                    {event.workoutSession.workoutResults.length} workout(s)
                  </div>
                </>
              ) : (
                <div className="flex gap-1.5 items-center">
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
            className="btn btn-error btn-outline btn-xs w-fit"
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
