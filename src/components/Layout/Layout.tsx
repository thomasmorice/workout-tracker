import { signIn, signOut, useSession } from "next-auth/react";
import { useWorkoutFormStore } from "../../store/WorkoutFormStore";
import WorkoutForm from "../Workout/WorkoutForm";
import Logo from "./Logo";
import Navigation from "./Navigation/Navigation";
import ThemeSwitcher from "./ThemeSwitcher";
import Image from "next/image";
import ToastMessage from "./ToastMessage";
import { Rings } from "react-loading-icons";

interface LayoutProps {
  children: React.ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  const { data: sessionData, status } = useSession();
  const { state: workoutFromState } = useWorkoutFormStore();
  return (
    <div>
      <ToastMessage />
      <Navigation />

      {workoutFromState && <WorkoutForm />}

      <main className={`px-5 sm:px-8 md:ml-[320px]`}>
        <div className="flex w-full justify-between py-5 md:justify-end items-center">
          <div className="md:hidden">
            <Logo />
          </div>
          {status === "loading" ? (
            <>
              <div className="flex items-center gap-x-2">
                <Rings className="text-xl" />
              </div>
            </>
          ) : (
            <>
              {sessionData ? (
                <button
                  onClick={() => signOut()}
                  className="avatar btn btn-circle"
                >
                  <div className="w-11 relative rounded-full ring ring-base-200">
                    <Image
                      layout="fill"
                      referrerPolicy="no-referrer"
                      src={
                        sessionData.user?.image ?? "https://i.pravatar.cc/300"
                      }
                      alt=""
                    />
                  </div>
                </button>
              ) : (
                <button onClick={() => signIn()} className="btn btn-ghost">
                  Login
                </button>
              )}
            </>
          )}

          {/* <ThemeSwitcher /> */}
        </div>
        {children}
      </main>
    </div>
  );
}
