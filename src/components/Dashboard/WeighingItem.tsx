import { formatDistance } from "date-fns";
import { useMemo } from "react";
import { MdMonitorWeight } from "react-icons/md";
import { useWeighingService } from "../../services/useWeighingService";
import { Rings } from "react-loading-icons";

export default function WeighingItem() {
  const { getWeighings } = useWeighingService();

  const { data: twoLatestWeighings, isLoading } = getWeighings({
    take: 2,
  });

  const hasLostWeight = useMemo(() => {
    if (twoLatestWeighings && twoLatestWeighings[0] && twoLatestWeighings[1]) {
      return twoLatestWeighings[0].weight < twoLatestWeighings[1].weight;
    }
  }, [twoLatestWeighings]);

  const getLatestWeight = useMemo(() => {
    if (twoLatestWeighings && twoLatestWeighings[0]) {
      return twoLatestWeighings[0];
    }
    return null;
  }, [twoLatestWeighings]);

  const getSecondToLastWeight = useMemo(() => {
    if (twoLatestWeighings && twoLatestWeighings[1]) {
      return twoLatestWeighings[1];
    }
    return null;
  }, [twoLatestWeighings]);

  return (
    <>
      <div className="stats bg-base-200">
        <div className="stat">
          <div className="stat-figure"></div>
          <div className="stat-title flex items-center gap-2 leading-none">
            <MdMonitorWeight size={26} />
            <div className="flex flex-col gap-0.5">
              <span className="text-lg leading-none">Latest weight</span>
              <div className="text-2xs">
                {getLatestWeight
                  ? `${formatDistance(
                      Date.now(),
                      getLatestWeight.event.eventDate
                    )} ago`
                  : "-"}
              </div>
            </div>
          </div>
          <div className="stat-value">
            {getLatestWeight ? (
              `${getLatestWeight.weight}Kg`
            ) : (
              <div className="flex items-center gap-0.5 text-xs">
                <Rings />
                Fetching data
              </div>
            )}
          </div>

          {getLatestWeight && getSecondToLastWeight && (
            <div
              className={`stat-desc ${
                hasLostWeight ? "text-success" : "text-error"
              }`}
            >
              {hasLostWeight ? "↘" : "↗"}
              {` ${(
                getLatestWeight.weight - getSecondToLastWeight.weight
              ).toFixed(3)}`}
              Kg
              {` (${getSecondToLastWeight.weight}Kg)`}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
