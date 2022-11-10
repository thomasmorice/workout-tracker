import { NextPage } from "next";
import Image from "next/image";
import Head from "next/head";
import { useSession } from "next-auth/react";
import AvatarButton from "../components/AvatarButton/AvatarButton";

const Profile: NextPage = () => {
  const { data: sessionData } = useSession();
  console.log("sessionData", sessionData);
  return (
    <>
      <Head>
        <>
          <title>Profile</title>
          <meta
            name="description"
            content="Update your profile, set-up your account"
          />
        </>

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="h1 desktop mb-8">My profile</h1>

      <div className="flex flex-wrap items-center gap-3">
        <Image
          width={62}
          height={62}
          className="rounded-full"
          referrerPolicy="no-referrer"
          src={sessionData?.user?.image ?? "https://i.pravatar.cc/300"}
          alt=""
        />
        <div className="inline-flex  items-center gap-3 rounded-lg bg-base-200 p-2 px-6">
          <label className="label" htmlFor="">
            Name
          </label>
          <p className="font-bold text-accent-content">
            {sessionData?.user?.name}
          </p>
        </div>

        <div className="inline-flex  items-center gap-3 rounded-lg bg-base-200 p-2 px-6">
          <label className="label" htmlFor="">
            Email
          </label>
          <p className="font-bold text-accent-content">
            {sessionData?.user?.email}
          </p>
        </div>
      </div>
    </>
  );
};

export default Profile;
