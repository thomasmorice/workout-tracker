import { useWorkoutSessionService } from "../../services/useWorkoutSessionService";
import { useToastStore } from "../../store/ToastStore";
import ConfirmModal from "../Layout/Navigation/Modal/ConfirmModal";
import { useState } from "react";
import { InferQueryOutput } from "../../types/trpc";
import {
  MdOutlineCalendarToday,
  MdTimer,
  MdChecklistRtl,
  MdDelete,
} from "react-icons/md";
import {
  getSessionDate,
  getSessionTitle,
  getSessionTotalTime,
} from "../../utils/utils";
import { useScheduleStore } from "../../store/ScheduleStore";
import { isBefore } from "date-fns";

interface TimelineSessionProps {
  session: InferQueryOutput<"workout-session.get-workout-sessions">[number];
  isSessionDone?: boolean;
}

export default function TimelineSession({
  session,
}: // isSessionDone = true,
TimelineSessionProps) {
  const { deleteWorkoutSession } = useWorkoutSessionService();
  const { addMessage, closeMessage } = useToastStore();
  const [showConfirmDeleteSessionModal, set_showConfirmDeleteSessionModal] =
    useState(false);

  const { editSession } = useScheduleStore();

  return (
    <>
      <div className="mb-8 ml-4 group cursor-pointer">
        <div onClick={() => editSession(session)} className="">
          <div
            className={`absolute transition-all w-3 h-3 rounded-full -left-1.5 border border-opacity-10
          ${
            isBefore(session.date, Date.now())
              ? "bg-base-300 border-accent-content group-hover:bg-base-100"
              : "bg-primary border-primary"
          }`}
          ></div>
          <div className="gap-2 flex flex-col group-hover:translate-x-1 transition-transform">
            <h3 className="font-semibold text-accent-content -mt-1.5 flex gap-2 items-center">
              {getSessionTitle(session)}
              {/* <MdOpenInFull size={12} /> */}
            </h3>
            <div className=" font-light text-xs flex flex-col gap-2 ">
              <div className="flex gap-1.5 items-center">
                <MdOutlineCalendarToday className="opacity-50" size={16} />
                <time className="">{getSessionDate(session)}</time>
              </div>

              <div className="flex gap-1.5 items-center ">
                <MdTimer className="opacity-50" size={16} />
                {getSessionTotalTime(session)}mn session
              </div>

              <div className="flex gap-1.5 items-center">
                <MdChecklistRtl className="opacity-50" size={16} />
                {session.workoutResults.length} workout(s)
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2">
          <button
            onClick={() => set_showConfirmDeleteSessionModal(true)}
            type="button"
            className="btn btn-error btn-outline btn-xs w-fit"
          >
            <MdDelete />
          </button>
        </div>
      </div>

      {showConfirmDeleteSessionModal && (
        <ConfirmModal
          onConfirm={async () => {
            const message = addMessage({
              type: "pending",
              message: "Deleting session and results associated",
            });
            await deleteWorkoutSession.mutateAsync({
              id: session.id,
            });
            addMessage({
              type: "success",
              message: "Session deleted successfully",
            });
            closeMessage(message);
            set_showConfirmDeleteSessionModal(false);
          }}
          onClose={() => set_showConfirmDeleteSessionModal(false)}
          title="Confirm delete session"
        >
          <p>
            Are you sure you wanna delete this workout session and all the
            results associated?
          </p>
        </ConfirmModal>
      )}
    </>
  );
}
