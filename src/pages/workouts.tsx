import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Header from "../components/Layout/Header";
import WorkoutList from "../components/Workout/WorkoutList";

const Workouts: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>Workouts</title>
        <meta name="description" content="Manage and share your workouts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header h1={"Workout list"} />

      {/* <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => showWorkoutForm("create")}
          className="btn btn-primary btn-sm hidden md:block"
        >
          + Create a new workout
        </button>
      </div> */}

      {sessionData && <WorkoutList />}
    </>
  );
};

export default Workouts;
