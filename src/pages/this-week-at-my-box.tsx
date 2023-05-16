import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect } from "react";
import H1 from "../components/H1/H1";
import Header from "../components/Layout/Header";
import WeeklyBoxWorkouts from "../components/Workout/WeeklyBoxWorkouts";
import WorkoutList from "../components/Workout/WorkoutList";
import { useToastStore } from "../store/ToastStore";

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

      <H1 line1={"This week"} line2={"at the box"} />

      {/* <h1 className="text-4xl leading-9">
        This week at <br /> my box
      </h1> */}

      {sessionData && <WeeklyBoxWorkouts />}
    </>
  );
};

export default ThisWeekAtMyBox;
