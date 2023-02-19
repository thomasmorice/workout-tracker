export default function WorkoutCardSkeleton() {
  return (
    <div className="card relative mb-8">
      <div className="flex space-x-4">
        <div className="card-body !bg-base-200">
          <div className="flex items-center justify-between">
            <div className="right-5 top-5 h-10 w-10 rounded-full bg-base-content opacity-20 sm:h-12 sm:w-12"></div>
            <div className="h-8 w-8 rounded bg-base-content opacity-20 "></div>
          </div>
          <div className="card-title mt-2">
            <div className="h-6 w-[180px] rounded bg-base-content opacity-20 "></div>
          </div>
          <div className="flex-1 space-y-6 py-1">
            <div className="space-y-3">
              <div className="h-2 rounded bg-base-content opacity-20 "></div>
              <div className="h-2 rounded bg-base-content opacity-20 "></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 h-2 rounded bg-base-content opacity-20 "></div>
                <div className="col-span-1 h-2 rounded bg-base-content opacity-20 "></div>
                <div className="col-span-1 h-2 rounded bg-base-content opacity-20 "></div>
                <div className="col-span-4 h-2 rounded bg-base-content opacity-20 "></div>
                <div className="col-span-2 h-2 rounded bg-base-content opacity-20 "></div>
                <div className="col-span-1 h-2 rounded bg-base-content opacity-20 "></div>
                <div className="col-span-1 h-2 rounded bg-base-content opacity-20 "></div>
                <div className="col-span-4 h-2 rounded bg-base-content opacity-20 "></div>
              </div>
            </div>
          </div>
          <div className="divider "></div>
          <div className="flex justify-between space-x-3">
            <div className="flex gap-3">
              <div className="h-3  w-[50px] rounded bg-primary"></div>
              <div className="h-3 w-[80px] rounded bg-secondary"></div>
            </div>
            <div className="h-3 w-3 rounded bg-primary"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
