import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import WorkoutSessionForm from "../../components/WorkoutSession/WorkoutSessionForm";

const CreateSession: NextPage = () => {
  return <WorkoutSessionForm />;
};

export default CreateSession;
