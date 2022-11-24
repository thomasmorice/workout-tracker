import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { AiFillBell } from "react-icons/ai";
import { useWorkoutSessionService } from "../services/useWorkoutSessionService";
import { formatISO } from "date-fns";
import PersonalRecordsInsights from "../components/Dashboard/PersonalRecords/PersonalRecordsInsights";
import WeighingsInsights from "../components/Dashboard/Weighings/WeighingsInsights";
import { useEffect } from "react";
import SessionInsights from "../components/Dashboard/Sessions/SessionsInsights";
import Header from "../components/Layout/Header";
import QuickActions from "../components/Dashboard/QuickActions/QuickActions";
import Lottie from "lottie-react";
import bicepsCurlAnimation from "../assets/lottie-biceps-curl-animation.json";

const Home: NextPage = () => {
  const { data: sessionData, status } = useSession();
  const { getWorkoutSessions } = useWorkoutSessionService();

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
        <>
          <Header h1={"Workout tracker"} />
          {status === "loading" ? (
            <>
              <Lottie animationData={bicepsCurlAnimation} loop={true} />
              <p className="text-center">
                Do some biceps curl while your information are being loaded :)
              </p>
            </>
          ) : (
            <p className="py-6">
              Welcome to your favorite workout tracking app. Please login first
              in order to start creating your first workout, or use the
              pre-existing ones to plan your very first session.
            </p>
          )}
        </>
      ) : (
        <>
          <Header h1={"Dashboard"} />
          <div className="flex flex-col  items-center gap-5 rounded-3xl bg-base-200 py-14 px-3 sm:flex-row sm:items-center sm:px-8">
            <div className="flex flex-col gap-2">
              <h3 className="text-center text-xl font-semibold text-base-content sm:text-left sm:text-3xl">
                Hello {sessionData.user?.name}
              </h3>
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
          <QuickActions />
          <SessionInsights />
          <PersonalRecordsInsights />
          <WeighingsInsights />
        </>
      )}
    </>
  );
};

export default Home;
