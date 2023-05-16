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

      <H1 line1={"Manage"} line2={"your workouts"} />

      {/* <h1 className="text-4xl">
        Manage <br />
        <div className="relative inline-flex items-center">
          your workouts
          <Image
            alt={"gym icon"}
            className="absolute -right-16 -z-20"
            src="/icons/gym/gym-dynamic-premium.png"
            width={62}
            height={62}
          />
        </div>
      </h1> */}

      <div className="mt-5">{sessionData && <WorkoutList />}</div>
    </>
  );
};

export default Workouts;
