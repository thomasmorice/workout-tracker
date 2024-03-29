import { NextPage } from "next";
import Image from "next/image";
import Head from "next/head";
import { useSession } from "next-auth/react";
import Header from "../components/Layout/Header";
import { MdClose, MdDelete, MdSearch } from "react-icons/md";
import { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { Affiliate } from "../types/app";
import { TailSpin } from "react-loading-icons";
import { trpc } from "../utils/trpc";

const Profile: NextPage = () => {
  const { data: sessionData } = useSession();
  const [searchTerm, set_searchTerm] = useState("");
  const searchTermDebounced = useDebounce<string>(searchTerm, 500);

  const [showAffiliates, set_showAffiliates] = useState(false);
  const [selectedAffiliate, set_selectedAffiliate] = useState<number>(-1);
  const [editAffiliate, set_editAffiliate] = useState(false);

  // const { data: affiliateDetails, isFetching: isFetchingAffiliate } =
  //   trpc.user.getAffiliateDetails.useQuery(
  //     {
  //       aid: selectedAffiliate,
  //     },
  //     {
  //       enabled: selectedAffiliate !== -1,
  //     }
  //   );

  const { data: userAffiliate, isFetching: isFetchingUserAffiliate } =
    trpc.user.getUserAffiliate.useQuery(undefined, {
      refetchOnWindowFocus: false,
    });

  const { data: affiliates, isFetching } = trpc.user.getAffiliates.useQuery(
    {
      term: searchTermDebounced,
    },
    {
      enabled: searchTermDebounced.length > 2,
    }
  );

  useEffect(() => {
    if (searchTermDebounced.length > 2 && !isFetching && affiliates) {
      set_showAffiliates(true);
    } else {
      set_showAffiliates(false);
    }
  }, [affiliates, isFetching, searchTermDebounced]);

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

      <Header h1={"My profile"} />

      <div className="flex flex-col items-center justify-center gap-4">
        <Image
          width={62}
          height={62}
          className="rounded-full"
          referrerPolicy="no-referrer"
          src={sessionData?.user?.image ?? "https://i.pravatar.cc/300"}
          alt=""
        />
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <p className="rounded-lg bg-base-200 px-3 py-3">
            {sessionData?.user?.name}
          </p>
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <p className="rounded-lg bg-base-200 px-3 py-3">
            {sessionData?.user?.email}
          </p>
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Affiliate</span>
          </label>

          {/* {userAffiliate && !editAffiliate && (
            <div className="relative flex w-full items-center justify-between">
              <label
                className="absolute z-10 ml-3"
                htmlFor="searchWorkoutInput"
              >
                <MdSearch size={22} />
              </label>
              <input
                id="searchWorkoutInput"
                type="search"
                placeholder="Search…"
                value={searchTerm}
                onChange={(e) => set_searchTerm(e.target.value)}
                className="input left-0 w-full bg-base-200 px-12"
              />
              {isFetching && (
                <label
                  className="absolute right-3 z-10"
                  htmlFor="searchWorkoutInput"
                >
                  <TailSpin width={20} />
                </label>
              )}
            </div>
          )} */}

          <div className="relative flex w-full items-center justify-between">
            <input
              id="affiliate"
              disabled
              placeholder="Fetching..."
              value={
                isFetchingUserAffiliate
                  ? ""
                  : userAffiliate
                  ? `${(userAffiliate as Affiliate).name} (${
                      (userAffiliate as Affiliate).state
                    })`
                  : "No affiliate"
              }
              onChange={(e) => set_searchTerm(e.target.value)}
              className="input input-disabled left-0 w-full bg-base-200"
            />
            {/* <label
              className="btn-ghost btn-sm btn absolute right-3 z-10"
              htmlFor="affiliate"
            >
              <MdDelete size={19} />
            </label> */}
          </div>

          {showAffiliates && (
            <div className="mt-2 max-h-64 w-full overflow-scroll rounded-xl border border-base-content border-opacity-10  bg-base-200">
              <div className="flex flex-col ">
                <div className="flex items-center justify-between px-5 py-4 text-sm font-bold">
                  <div>{`Search results (${affiliates?.length})`}</div>
                  <button
                    onClick={() => {
                      set_searchTerm("");
                      set_showAffiliates(false);
                    }}
                    className="btn-ghost btn-sm btn-circle btn"
                  >
                    <MdClose size={19} />
                  </button>
                </div>
                {affiliates?.map((affiliate: Affiliate) => (
                  <div
                    key={affiliate.aid}
                    onClick={() => {
                      set_selectedAffiliate(parseInt(affiliate.aid));
                      set_searchTerm("");
                      set_showAffiliates(false);
                    }}
                    className="cursor-pointer border-t border-base-content border-opacity-5 px-5 py-3 text-xs text-base-content text-opacity-70 hover:bg-base-100"
                  >
                    {affiliate.name} ({affiliate.state})
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
