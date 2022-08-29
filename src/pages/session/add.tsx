import { NextPage } from "next";
import Head from "next/head";
import WorkoutSessionForm from "../../components/WorkoutSession/WorkoutSessionForm/WorkoutSessionForm";

const Add: NextPage = () => {
  return (
    <>
      <Head>
        <title>Workout session</title>
        <meta name="description" content="Add or edit a session" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <WorkoutSessionForm />
    </>
  );
};

export default Add;
