import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { AiFillBell } from "react-icons/ai";
import { useWorkoutSessionService } from "../services/useWorkoutSessionService";
import { formatISO } from "date-fns";
import PersonalRecordsInsights from "../components/Dashboard/PersonalRecords/PersonalRecordsInsights";
import WeighingsInsights from "../components/Dashboard/Weighings/WeighingsInsights";
import SessionInsights from "../components/Dashboard/Sessions/SessionsInsights";
import Header from "../components/Layout/Header";
import Lottie from "lottie-react";
import lottieAnimation from "../assets/lottie-stretch-animation.json";

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
      </Head>

      {!sessionData ? (
        <>
          <Header h1={"Box Track"} />
          {status === "loading" ? (
            <div className="mx-8 flex flex-col items-center justify-center pt-8">
              <Lottie animationData={lottieAnimation} loop={true} />
              <p className="text-center font-light">
                Do some stretching while your information are being loaded
              </p>
            </div>
          ) : (
            <>
              <h2 className="mt-3 text-xl font-bold">Box Track</h2>
              <p className="py-6 text-base font-light">
                Welcome to Box Track, your ultimate workout tracking companion!{" "}
                <br />
                <br />
                With our app, you&apos;ll have the tools you need to track your
                progress and set new personal records. With each workout you
                log, you&apos;ll be able to see how far you&apos;ve come and how
                much stronger you&apos;ve become. <br />
                Our easy-to-use interface and interactive features make tracking
                your workouts fun and engaging. From logging your sets and reps
                to setting reminders and tracking your PRs, we&apos;ve got you
                covered. <br />
                <br />
                With Box Track, you&apos;ll be able to see your improvements in
                real-time, setting new goals and pushing yourself further.
                Whether you&apos;re a beginner or a seasoned pro, our app is
                designed to help you reach your fitness goals. <br />
                <br />
                So why wait? Start using Box Track now and start your journey to
                a stronger, healthier you! With Box Track you can also customize
                your workout plan, compare your performance with other users,
                and get personalized tips and advice from our fitness experts.
                With Box Track, the sky is the limit!
              </p>
            </>
          )}
        </>
      ) : (
        <>
          <Header h1={`Dashboard`} />
          <SessionInsights />
          <PersonalRecordsInsights />
          <WeighingsInsights />
        </>
      )}
    </>
  );
};

export default Home;
