import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import H1 from "../../../components/H1/H1";
import WorkoutSessionForm from "../../../components/WorkoutSession/WorkoutSessionForm";

const Edit: NextPage = () => {
  const router = useRouter();
  const id = parseInt(router.query.id as string, 10);

  return (
    <>
      <Head>
        <title>Edit workout session</title>
        <meta name="description" content="Add or edit a session" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <H1
        // icon="/icons/fire/fire-dynamic-premium.png"
        line1={"Edit"}
        line2={"this session"}
      />

      <WorkoutSessionForm existingSessionId={id} />
    </>
  );
};

export default Edit;
