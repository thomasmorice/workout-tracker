import { NextPage } from "next";
import Head from "next/head";
import H1 from "../../components/H1/H1";
import { useRouter } from "next/router";
import { useWorkoutStore } from "../../store/WorkoutStore";
import { useEventStore } from "../../store/EventStore";
import { MdModelTraining } from "react-icons/md";
import WorkoutSessionForm from "../../components/WorkoutSession/WorkoutSessionForm";

const CreateSession: NextPage = () => {
  const router = useRouter();
  const { setWorkoutSelectionMode } = useWorkoutStore();
  const { selectedWorkouts: preselectedWorkouts } = useWorkoutStore();
  const { closeForm } = useEventStore();

  return (
    <>
      <Head>
        <title>Create Workout session</title>
        <meta name="description" content="Add or edit a session" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <H1
        // icon="/icons/fire/fire-dynamic-premium.png"
        line1={"Create "}
        line2={"a new session"}
      />

      {preselectedWorkouts.length > 0 ? (
        <WorkoutSessionForm />
      ) : (
        <div className="mt-10 flex flex-col justify-center">
          <button
            type="button"
            className="btn-primary btn-sm mt-2 self-center rounded-full text-xs font-semibold uppercase"
            onClick={() => {
              router.push("/workouts");
              setWorkoutSelectionMode(true);
              closeForm();
            }}
          >
            Add a workout
          </button>

          <>
            <p className="pt-8 text-center text-sm font-light leading-loose">
              Don&apos;t have a workout in mind? No problem! Use our
              &quot;Suggest a session&quot; feature that provides a pre-made
              workout session for you. Once you&apos;re done with your workout,
              log your results and watch your progress soar! Our app is designed
              to make working out fun and engaging. So, let&apos;s get those
              endorphins flowing, stay consistent, and crush those fitness goals
              together!
            </p>

            <div className="flex w-full justify-center">
              <button
                type="button"
                disabled
                className="btn-disabled btn-sm btn mt-7 rounded-full text-center text-xs font-semibold uppercase"
              >
                <MdModelTraining size={19} />
                Suggest a session (soon)
              </button>
            </div>
          </>
        </div>
      )}
    </>
  );
};

export default CreateSession;
