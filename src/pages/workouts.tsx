import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect } from "react";
import WorkoutList from "../components/Workout/WorkoutList";
import Image from "next/image";
import WeeklyBoxWorkouts from "../components/Workout/WeeklyBoxWorkouts";
import Header from "../components/Layout/Header";

const Workouts: NextPage = () => {
  const { data: sessionData } = useSession();
  return (
    <>
      <Head>
        <title>Workouts</title>
        <meta name="description" content="Manage and share your workouts" />
      </Head>

      <Header h1="Workout Manager" />

      <div className="mt-5">{sessionData && <WorkoutList />}</div>
    </>
  );
};

export default Workouts;
