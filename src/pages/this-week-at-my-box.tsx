import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";

import H1 from "../components/H1/H1";

import WeeklyBoxWorkouts from "../components/Workout/WeeklyBoxWorkouts";

const ThisWeekAtMyBox: NextPage = () => {
  const { data: sessionData } = useSession();
  return (
    <>
      <Head>
        <title>This week at my box</title>
        <meta name="description" content="Manage and share your workouts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <Header h1={"This week at my box"} /> */}

      <H1> Weekly overview</H1>

      {/* <h1 className="text-4xl leading-9">
        This week at <br /> my box
      </h1> */}

      {sessionData && <WeeklyBoxWorkouts />}
    </>
  );
};

export default ThisWeekAtMyBox;
