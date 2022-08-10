import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { AiFillBell } from "react-icons/ai";
import { BsArrowUpRight } from "react-icons/bs";
import Image from "next/image";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  return (
    <>
      <Head>
        {sessionData ? (
          <>
            <title>Dashboard</title>
            <meta
              name="description"
              content="Dashboard of your workout routine"
            />
          </>
        ) : (
          <>
            <title>Welcome</title>
            <meta
              name="description"
              content="Welcome to the Ultimate Workout Tracker"
            />
          </>
        )}

        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!sessionData ? (
        <div className="hero rounded-3xl bg-base-200 py-16 ">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-3xl font-bold sm:text-5xl">
                Workout tracker
              </h1>
              <p className="py-6">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste,
                perspiciatis consequuntur in, similique quo magnam molestiae non
                delectus modi, beatae voluptatibus laboriosam. Cum, neque iste
                minus debitis inventore excepturi pariatur!
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col  items-center gap-5 rounded-3xl bg-base-200 py-14 px-3 sm:flex-row sm:items-center sm:px-8">
            <div className="avatar">
              <div className="mask mask-circle">
                <Image
                  width={80}
                  height={80}
                  src={sessionData.user?.image ?? "https://i.pravatar.cc/300"}
                  alt="Connected user avatar"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-center text-xl font-semibold text-base-content sm:text-left sm:text-3xl">
                Hello {sessionData.user?.name}
              </h1>
              <div className="dimmed flex  gap-1 font-light">
                <AiFillBell className="hidden sm:block" size="20" />
                <p className="flex-1 text-center sm:text-left">
                  You have 2 new messages and 15 new tasks
                </p>
              </div>
            </div>
          </div>

          <div className="tabs tabs-boxed mt-3 w-fit sm:mt-5">
            <a className="tab">Weekly</a>
            <a className="tab tab-active">Monthly</a>
            <a className="tab">Yearly</a>
          </div>
          <div className="flex w-full flex-wrap gap-4 py-3 sm:gap-8 sm:py-5">
            <div className="stats stats-vertical bg-base-200 shadow lg:stats-horizontal">
              <div className="flex max-w-[160px] items-center justify-center bg-primary p-3 text-center text-primary-content">
                Personal records
              </div>
              <div className="stat">
                <div className="stat-title">Deadlift</div>
                <div className="stat-value">142KG</div>
                <div className="stat-desc flex items-center gap-x-1 text-success-content">
                  <BsArrowUpRight /> 2KG (10%)
                </div>
              </div>
            </div>
            <div className="stats bg-base-200 shadow">
              <div className="stat ">
                <div className="stat-title">Total workout time</div>
                <div className="stat-value">12h32</div>
                <div className="stat-desc">21% more than last month</div>
              </div>
            </div>

            <div className="stats bg-base-200 shadow">
              <div className="stat">
                <div className="stat-title">Difficulty repartition</div>
                <div className="stat-value"></div>
                <div className="stat-desc">21% more than last month</div>
              </div>
            </div>

            <div className="stats max-h-32 bg-base-200 shadow">
              <div className="stat">
                <div className="stat-title">Average feeling</div>
                <div className="stat-value ">4.3</div>
                <div className="stat-desc">Pretty happy</div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
