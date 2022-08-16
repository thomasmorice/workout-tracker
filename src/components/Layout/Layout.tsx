import { signIn, signOut, useSession } from "next-auth/react";
import { useWorkoutFormStore } from "../../store/WorkoutFormStore";
import WorkoutForm from "../Workout/WorkoutForm";
import Logo from "./Logo";
import Navigation from "./Navigation/Navigation";
import ThemeSwitcher from "./ThemeSwitcher";
import Image from "next/image";
import ToastMessage from "./ToastMessage";
import { Rings } from "react-loading-icons";
import { useRouter } from "next/router";
import { MdLogin } from "react-icons/md";
import { useEffect, useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  const { state: workoutFromState } = useWorkoutFormStore();
  const [currentPath, set_currentPath] = useState<String[]>();

  useEffect(() => {
    const asPathWithoutQuery = router.pathname.split("?")[0];
    set_currentPath(asPathWithoutQuery?.split("/").filter((v) => v.length > 0));
  }, [router.pathname]);

  return (
    <div>
      <ToastMessage />
      <Navigation />

      {workoutFromState && <WorkoutForm />}

      <main className={`px-5 sm:px-8 md:ml-[320px]`}>
        <div className="flex w-full justify-between py-5 items-center">
          <div className="hidden md:block text-sm breadcrumbs">
            <ul>
              <li className="capitalize" key={"home"}>
                Home
              </li>
              {currentPath?.map((path, index) => (
                <li key={index}>
                  <a className="capitalize">{path}</a>
                </li>
              ))}
            </ul>
          </div>
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
                <button
                  onClick={() => signIn()}
                  className="btn btn-ghost flex gap-x-2"
                >
                  <MdLogin size="22px" />
                  Login
                </button>
              )}
            </>
          )}
        </div>
        {children}
      </main>
    </div>
  );
}
