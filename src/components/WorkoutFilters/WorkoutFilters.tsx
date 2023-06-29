import { useLockedBody } from "usehooks-ts";
import { Difficulty, ElementType, WorkoutType } from "@prisma/client";
import { enumToString } from "../../utils/formatting";
import MultiRangeSlider from "../MultiRangeSlider/MultiRangeSlider";
import { useState } from "react";

export interface IWorkoutFilters {
  global?: "classified" | "benchmarks" | "recommended";
  difficulty?: Difficulty;
  elementType?: ElementType;
  workoutType?: WorkoutType;
  minDuration?: number;
  maxDuration?: number;
}

type WorkoutFiltersProps = {
  savedFilters?: IWorkoutFilters;
  updateFilters: (filters: IWorkoutFilters) => void;
};

export const defaultFilters: IWorkoutFilters = {
  global: "classified",
};

export default function WorkoutFilters({
  savedFilters = defaultFilters,
  updateFilters,
}: WorkoutFiltersProps) {
  const [filters, set_filters] = useState<IWorkoutFilters>(savedFilters);

  useLockedBody();

  return (
    <>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          onClick={() =>
            set_filters({
              ...filters,
              global: undefined,
            })
          }
          className={`badge badge-lg font-medium ${
            !filters.global ? "badge-primary" : "badge-neutral"
          }`}
        >
          All workouts
        </button>
        <button
          onClick={() =>
            set_filters({
              ...filters,
              global: "classified",
            })
          }
          className={`badge badge-lg font-medium ${
            filters.global === "classified" ? "badge-primary" : "badge-neutral"
          }`}
        >
          Classified
        </button>
        <button
          onClick={() =>
            set_filters({
              ...filters,
              global: "benchmarks",
            })
          }
          className={`badge badge-lg font-medium ${
            filters.global === "benchmarks" ? "badge-primary" : "badge-neutral"
          }`}
        >
          Benchmarks
        </button>

        <button
          onClick={() =>
            set_filters({
              ...filters,
              global: "recommended",
            })
          }
          className={`badge badge-lg font-medium ${
            filters.global === "recommended" ? "badge-primary" : "badge-neutral"
          }`}
        >
          Saved for later
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-1.5">
        <div className="form-control">
          <label htmlFor="difficulty" className="label label-text">
            Difficulty
          </label>
          <select
            id="difficulty"
            defaultValue={filters?.difficulty}
            className="select w-full max-w-xs bg-base-200"
            onChange={(e) =>
              set_filters({
                ...filters,
                difficulty:
                  e.target.value === ""
                    ? undefined
                    : (e.target.value as Difficulty),
              })
            }
          >
            <option value={""}>All difficulties</option>
            {Object.keys(Difficulty).map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {enumToString(difficulty).toLowerCase()}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control">
          <label htmlFor="type" className="label label-text">
            Workout type
          </label>
          <select
            id="type"
            className="select w-full max-w-xs bg-base-200"
            defaultValue={filters?.workoutType}
            onChange={(e) =>
              set_filters({
                ...filters,
                workoutType:
                  e.target.value === ""
                    ? undefined
                    : (e.target.value as WorkoutType),
              })
            }
          >
            <option value={""}>All types</option>
            {Object.keys(WorkoutType).map((type) => (
              <option key={type} value={type}>
                {enumToString(type).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label htmlFor="element-type" className="label label-text">
            Element Type
          </label>
          <select
            id="element-type"
            defaultValue={filters?.elementType}
            className="select w-full max-w-xs bg-base-200"
            onChange={(e) =>
              set_filters({
                ...filters,
                elementType:
                  e.target.value === ""
                    ? undefined
                    : (e.target.value as ElementType),
              })
            }
          >
            <option value={""}>All elements</option>
            {Object.keys(ElementType).map((elementType) => (
              <option key={elementType} value={elementType}>
                {enumToString(elementType).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label htmlFor="duration" className="label label-text">
            Workout duration
          </label>
          <MultiRangeSlider
            defaultValueMin={filters?.minDuration}
            defaultValueMax={filters?.maxDuration}
            onMinValueChange={(value) =>
              set_filters({
                ...filters,
                minDuration: value,
              })
            }
            onMaxValueChange={(value) =>
              set_filters({
                ...filters,
                maxDuration: value,
              })
            }
            className="mt-2"
            min={0}
            max={120}
          />
        </div>
      </div>
      <div className="modal-action mt-8 flex gap-3">
        <button
          onClick={() => updateFilters(filters)}
          className="btn-primary btn-sm btn"
        >
          Save filters
        </button>
        <button
          onClick={() => {
            updateFilters({ ...savedFilters });
          }}
          className="btn-neutral btn-sm btn"
        >
          Reset
        </button>
      </div>
    </>
  );
}
