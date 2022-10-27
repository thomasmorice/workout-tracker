import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { AiFillBell } from "react-icons/ai";
import Image from "next/image";
import WeighingItem from "../components/Dashboard/WeighingItem";
import { useWorkoutSessionService } from "../services/useWorkoutSessionService";
import { useWorkoutService } from "../services/useWorkoutService";
import { formatISO } from "date-fns";
import { Rings } from "react-loading-icons";
import PersonalRecordItem from "../components/Dashboard/PersonalRecordItem";
import { useWeighingService } from "../services/useWeighingService";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const { countAllSessions, getWorkoutSessions } = useWorkoutSessionService();
  const { getInfiniteWorkouts } = useWorkoutService();
  const { getWeighings } = useWeighingService();

  const { data: latestWeighings, isLoading: isLoadingWeights } = getWeighings({
    take: 8,
  });
  const { data: allSessionsCount, isLoading: isLoadingCountSession } =
    countAllSessions();
  const { data: personalRecordWorkouts, isLoading: isLoadingPersonalRecords } =
    getInfiniteWorkouts({
      workoutTypes: ["ONE_REP_MAX"],
      orderResults: [
        {
          weight: "desc",
        },
        {
          time: "asc",
        },
        {
          totalReps: "desc",
        },
      ],
      limit: 8,
      withResults: true,
    });

  const { data: upcomingWorkoutSession } = getWorkoutSessions({
    dateFilter: {
      gte: formatISO(new Date()),
    },
  });

  return (
    <>
      <Head>
        {sessionData ? (
          <>
            <title>Dashboard</title>
            <meta
              name="description"
              content="Dashboard of your workout routine"
            />
          </>
        ) : (
          <>
            <title>Welcome</title>
            <meta
              name="description"
              content="Welcome to the Ultimate Workout Tracker"
            />
          </>
        )}

        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!sessionData ? (
        <div className="hero rounded-3xl bg-base-200 py-16 ">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-3xl font-bold sm:text-5xl">
                Workout tracker
              </h1>
              <p className="py-6">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste,
                perspiciatis consequuntur in, similique quo magnam molestiae non
                delectus modi, beatae voluptatibus laboriosam. Cum, neque iste
                minus debitis inventore excepturi pariatur!
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <h1 className="h1 mb-8">Dashboard</h1>
          <div className="flex flex-col  items-center gap-5 rounded-3xl bg-base-200 py-14 px-3 sm:flex-row sm:items-center sm:px-8">
            <div className="avatar">
              <div className="mask mask-circle">
                <Image
                  width={80}
                  height={80}
                  src={sessionData.user?.image ?? "https://i.pravatar.cc/300"}
                  alt="Connected user avatar"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-center text-xl font-semibold text-base-content sm:text-left sm:text-3xl">
                Hello {sessionData.user?.name}
              </h1>
              <div className="dimmed flex  gap-1 font-light">
                <AiFillBell className="hidden sm:block" size="20" />
                <p className="flex-1 text-center sm:text-left">
                  {upcomingWorkoutSession?.length ? (
                    <>
                      You have {upcomingWorkoutSession?.length} session(s)
                      planned in the future.
                    </>
                  ) : (
                    <>You have currently no session planned in the future</>
                  )}
                </p>
              </div>
            </div>
          </div>

          <h2 className="h2 mt-10 mb-4">Latest personal records</h2>
          <div className="flex w-full flex-wrap gap-4 py-3 sm:gap-8 sm:py-5">
            {isLoadingPersonalRecords ? (
              <Rings />
            ) : (
              personalRecordWorkouts &&
              personalRecordWorkouts.pages[0]?.workouts.map((workout) => (
                <PersonalRecordItem
                  key={workout.id}
                  personalRecordWorkout={workout}
                />
              ))
            )}
          </div>

          <h2 className="h2 mt-10 mb-4">Others</h2>
          <div className="flex w-full flex-wrap gap-4 py-3 sm:gap-8 sm:py-5">
            {isLoadingWeights && <Rings />}
            {latestWeighings?.length && (
              <WeighingItem weighings={latestWeighings} />
            )}

            {/* <div className="stats bg-base-200 shadow">
              <div className="stat">
                <div className="stat-title">
                  Number of sessions
                  <br /> since the beginning
                </div>
                <div className="stat-value">
                  {isLoadingCountSession ? <Rings /> : `${allSessionsCount}`}
                </div>
              </div>
            </div>

            <div className="stats max-h-32 bg-base-200 shadow">
              <div className="stat">
                <div className="stat-title">Average feeling</div>
                <div className="stat-value ">4.3</div>
                <div className="stat-desc">Pretty happy</div>
              </div>
            </div> */}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
