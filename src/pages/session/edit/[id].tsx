import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import WorkoutSessionForm from "../../../components/WorkoutSession/WorkoutSessionForm";
import { useWorkoutSessionService } from "../../../services/useWorkoutSessionService";

const Edit: NextPage = () => {
  const router = useRouter();
  const id = parseInt(router.query.id as string, 10);
  const { getWorkoutSessionById } = useWorkoutSessionService();

  const { data: workoutSession, isFetching } = getWorkoutSessionById(id);
  console.log("workoutSession", workoutSession);
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

export default Edit;
