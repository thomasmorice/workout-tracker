import { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import WorkoutCardFull from "../../components/Workout/WorkoutCard/WorkoutCard.Fetch";

const Workout: NextPage = () => {
  const router = useRouter();
  const id = parseInt(router.query.id as string, 10);
  return <WorkoutCardFull id={id} />;
};

export default Workout;
