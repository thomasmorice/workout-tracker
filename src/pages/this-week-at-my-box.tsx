import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect } from "react";
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

      <Header h1={"This week at my box"} />

      {/* <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => showWorkoutForm("create")}
          className="btn btn-primary btn-sm hidden md:block"
        >
          + Create a new workout
        </button>
      </div> */}
      {/* <button
        onClick={() => {
          addMessage({
            type: "pending",
            message: "test",
          });
        }}
        className="btn my-3"
      >
        Toast!
      </button> */}
      {sessionData && <WeeklyBoxWorkouts />}
    </>
  );
};

export default ThisWeekAtMyBox;
