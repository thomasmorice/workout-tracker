import { NextPage } from "next";
import Head from "next/head";
import WorkoutSessionForm from "../../components/WorkoutSession/WorkoutSessionForm";

const CreateSession: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create Workout session</title>
        <meta name="description" content="Add or edit a session" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WorkoutSessionForm />
    </>
  );
};

export default CreateSession;
