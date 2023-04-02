import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import WorkoutSessionForm from "../../../components/WorkoutSession/WorkoutSessionForm";
import { trpc } from "../../../utils/trpc";

const Edit: NextPage = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const id = parseInt(router.query.id as string, 10);

  // const { data: workoutSession, isFetching } =
  //   trpc.workoutSession.getWorkoutSessionById.useQuery(
  //     {
  //       id,
  //     },
  //     {
  //       enabled: sessionData?.user !== undefined && id !== -1,
  //       refetchOnWindowFocus: false,
  //     }
  //   );
  return (
    <>
      <Head>
        <title>Edit workout session</title>
        <meta name="description" content="Add or edit a session" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <WorkoutSessionForm existingSessionId={id} />
    </>
  );
};

export default Edit;
