import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect } from "react";
import WorkoutList from "../components/Workout/WorkoutList";
import Image from "next/image";
import H1 from "../components/H1/H1";
import WeeklyBoxWorkouts from "../components/Workout/WeeklyBoxWorkouts";

const Workouts: NextPage = () => {
  const { data: sessionData } = useSession();
  return (
    <>
      <Head>
        <title>Workouts</title>
        <meta name="description" content="Manage and share your workouts" />
      </Head>

      <H1> Workout Manager </H1>

      <div className="mt-5">{sessionData && <WorkoutList />}</div>
    </>
  );
};

export default Workouts;
