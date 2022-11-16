import { formatDistance } from "date-fns";
import { useMemo } from "react";
import { MdMonitorWeight } from "react-icons/md";
import { useWeighingService } from "../../../services/useWeighingService";
import { Rings } from "react-loading-icons";
import DashboardItem from "../DashboardItem";
import { InferQueryOutput } from "../../../types/trpc";

type WeighingItemProps = {
  weighings: InferQueryOutput<"weighing.getWeightings">;
};

export default function WeighingItem({ weighings }: WeighingItemProps) {
  const hasLostWeight = useMemo(() => {
    if (weighings && weighings[0] && weighings[1]) {
      return weighings[0].weight < weighings[1].weight;
    }
  }, [weighings]);

  const getLatestWeight = useMemo(() => {
    if (weighings && weighings[0]) {
      return weighings[0];
    }
    return null;
  }, [weighings]);

  const getSecondToLastWeight = useMemo(() => {
    if (weighings && weighings[1]) {
      return weighings[1];
    }
    return null;
  }, [weighings]);

  return (
    <>
      <DashboardItem
        graphNumbers={[...weighings]
          .reverse()
          .map((weighting) => weighting.weight)}
        title="Latest weightings"
      >
        <div className="relative z-10 flex items-center gap-2">
          <div className="text-2xl font-bold text-accent-content">
            {getLatestWeight && `${getLatestWeight.weight}Kg`}
          </div>
        </div>
      </DashboardItem>
    </>
  );
}
