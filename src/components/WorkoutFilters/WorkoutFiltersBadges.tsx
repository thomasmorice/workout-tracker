import { MdClose } from "react-icons/md";
import { enumToString } from "../../utils/formatting";
import { defaultFilters, IWorkoutFilters } from "./WorkoutFilters";

type WorkoutFiltersBadgesProps = {
  filters?: IWorkoutFilters;
  setFilters: (filters: IWorkoutFilters) => void;
};

export default function WorkoutFiltersBadges({
  filters,
  setFilters,
}: WorkoutFiltersBadgesProps) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-2 py-1">
        {filters && !filters.global && (
          <div className="badge badge-primary badge-lg cursor-pointer gap-1">
            <MdClose
              size={14}
              onClick={() =>
                setFilters({
                  ...filters,
                  global: "classified",
                })
              }
            />
            All available workouts
          </div>
        )}

        {filters?.difficulty && (
          <div className="badge badge-lg cursor-pointer gap-1">
            <MdClose
              size={14}
              onClick={() =>
                setFilters({
                  ...filters,
                  difficulty: undefined,
                })
              }
            />
            {enumToString(filters.difficulty)}
          </div>
        )}

        {filters?.workoutType && (
          <div className="badge badge-lg cursor-pointer gap-1 ">
            <MdClose
              size={14}
              onClick={() =>
                setFilters({
                  ...filters,
                  workoutType: undefined,
                })
              }
            />
            {enumToString(filters.workoutType)}
          </div>
        )}

        {filters?.elementType && (
          <div className="badge badge-lg cursor-pointer gap-1 ">
            <MdClose
              size={14}
              onClick={() =>
                setFilters({
                  ...filters,
                  elementType: undefined,
                })
              }
            />
            {enumToString(filters.elementType)}
          </div>
        )}

        {filters?.minDuration && (
          <div className="badge badge-lg cursor-pointer gap-1 ">
            <MdClose
              size={14}
              onClick={() =>
                setFilters({
                  ...filters,
                  minDuration: undefined,
                })
              }
            />
            Min. duration: {filters.minDuration}mn
          </div>
        )}

        {filters?.maxDuration && (
          <div className="badge badge-lg cursor-pointer gap-1 ">
            <MdClose
              size={14}
              onClick={() =>
                setFilters({
                  ...filters,
                  maxDuration: undefined,
                })
              }
            />
            Max. duration: {filters.maxDuration}mn
          </div>
        )}
        {JSON.stringify(defaultFilters) !== JSON.stringify(filters) && (
          <div className="badge badge-primary badge-lg cursor-pointer gap-1 ">
            <MdClose
              size={14}
              onClick={() => setFilters({ ...defaultFilters })}
            />
            Clear all filters
          </div>
        )}
      </div>
    </>
  );
}
