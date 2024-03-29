import { useToastStore } from "../../store/ToastStore";
import ConfirmModal from "../Layout/Modal/ConfirmModal";
import { useState } from "react";
import {
  MdTimer,
  MdChecklistRtl,
  MdDelete,
  MdMonitorWeight,
  MdOutlineEvent,
} from "react-icons/md";
import { getSessionTitle, getSessionTotalTime } from "../../utils/utils";
import { format } from "date-fns";
import { useEventStore } from "../../store/EventStore";
import { zonedTimeToUtc } from "date-fns-tz";
import { inferRouterOutputs, TRPCError } from "@trpc/server";
import { EventRouterType } from "../../server/trpc/router/event-router";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import Portal from "../Portal/Portal";

interface TimelineSessionProps {
  event: inferRouterOutputs<EventRouterType>["getEvents"][number];
}

export default function TimelineItem({ event }: TimelineSessionProps) {
  const utils = trpc.useContext();
  const router = useRouter();
  const { addOrEditEvent } = useEventStore();
  const { addMessage, closeMessage } = useToastStore();
  const [showConfirmDeleteEventModal, set_showConfirmDeleteEventModal] =
    useState(false);

  const deleteEvent = trpc.event.delete.useMutation({
    async onSuccess() {
      utils.event.getEvents.invalidate();
    },
  });

  return (
    <>
      <div className="relative mb-6 cursor-pointer rounded-md border border-base-content border-opacity-10 bg-base-200 bg-opacity-50 p-5  transition-transform hover:-translate-y-1">
        <div
          onClick={() => {
            if (event.workoutSession) {
              router.push(`/session/edit/${event.workoutSession.id}`);
            } else {
              addOrEditEvent({
                eventId: event.weighing?.id,
                type: "weighing",
              });
            }
          }}
          className="group"
        >
          <div className="flex flex-col gap-2 transition-transform">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <MdOutlineEvent size={21} className="text-primary" />
                <time className="flex items-center gap-2 text-sm ">
                  {format(
                    zonedTimeToUtc(event.eventDate, "Europe/Stockholm"),
                    "EEEE, LLL dd, u"
                  )}
                </time>
              </div>
              <div className="badge badge-primary">
                {" "}
                {format(
                  zonedTimeToUtc(event.eventDate, "Europe/Stockholm"),
                  "p"
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 pt-4 text-xs font-light ">
              <div className="flex items-center gap-1.5 text-sm font-medium">
                {event.workoutSession
                  ? getSessionTitle(event.workoutSession)
                  : "Weighing"}
              </div>
              {event.workoutSession ? (
                <>
                  <div className="flex items-center gap-1.5 ">
                    <MdTimer className="" size={16} />
                    {getSessionTotalTime(event.workoutSession)}mn session
                  </div>

                  <div className="flex items-center gap-1.5">
                    <MdChecklistRtl className="" size={16} />
                    {event.workoutSession.workoutResults.length} workout(s)
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-1.5">
                  <MdMonitorWeight className="" size={16} />
                  <div className="">{event.weighing?.weight}KG</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-3 right-3">
          <button
            onClick={() => set_showConfirmDeleteEventModal(true)}
            type="button"
            className="btn-outline btn-error btn-xs btn w-fit"
          >
            <div className="flex items-center gap-2">
              <MdDelete />
              Delete
            </div>
          </button>
        </div>
      </div>
      <Portal>
        <ConfirmModal
          isOpen={showConfirmDeleteEventModal}
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
      </Portal>
    </>
  );
}
