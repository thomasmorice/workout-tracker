"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useWorkoutStore } from "../src/store/WorkoutStore";
import WorkoutForm from "./components/Workout/WorkoutForm";
import Navigation from "./components/Layout/Navigation/Navigation";
import ToastMessage from "./components/Layout/ToastMessage";
import { useRouter } from "next/router";
import { MdLogin } from "react-icons/md";
import { useEffect, useState } from "react";
import RightSidebar from "./components/RightSidebar/RightSidebar";
import { useSidebarStore } from "../src/store/SidebarStore";
import AuthContext from "./AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const router = useRouter();
  const { isSidebarExpanded } = useSidebarStore();
  const { state: workoutFormState } = useWorkoutStore();
  const [currentPath, set_currentPath] = useState<String[]>();

  // useEffect(() => {
  //   const asPathWithoutQuery = router.pathname.split("?")[0];
  //   set_currentPath(asPathWithoutQuery?.split("/").filter((v) => v.length > 0));
  // }, [router.pathname]);

  return (
    <AuthContext>
      <html>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          />
          <link rel="manifest" href="/manifest.json" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />

          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#2A303C" />
          <meta
            name="viewport"
            content="initial-scale=1, user-scalable=no, width=device-width, height=device-height, viewport-fit=cover"
          />
        </head>
        <body>
          <div>
            <ToastMessage />
            <Navigation />
            {status === "authenticated" && (
              <div className="hidden md:block">
                <RightSidebar />
              </div>
            )}
            {workoutFormState && <WorkoutForm />}
            <div id="portal" />

            <main
              className={`px-5 pb-24 transition-all sm:px-8 md:pb-0 
          ${isSidebarExpanded ? "md:ml-64" : "md:ml-16 xl:ml-20"}
          ${status === "authenticated" ? "md:mr-80 xl:mr-[340px]" : ""}
        `}
            >
              <div className="hidden items-center justify-between py-6 md:flex">
                <div className="breadcrumbs  text-sm ">
                  <ul>
                    <li className="capitalize" key={"home"}>
                      Home
                    </li>
                    {currentPath?.map((path, index) => (
                      <li className="" key={index}>
                        <a className="capitalize">{path}</a>
                      </li>
                    ))}
                  </ul>
                </div>
                {status === "unauthenticated" && (
                  <button
                    type="button"
                    onClick={() => signIn()}
                    className="btn btn-primary flex gap-x-2"
                  >
                    <MdLogin size="22px" />
                    Login
                  </button>
                )}
              </div>

              {children}
            </main>
          </div>
        </body>
      </html>
    </AuthContext>
  );
}
