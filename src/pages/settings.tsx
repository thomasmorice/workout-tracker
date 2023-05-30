import { NextPage } from "next";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { TailSpin } from "react-loading-icons";
import { useDebounce } from "usehooks-ts";

import H1 from "../components/H1/H1";
import { Affiliate } from "../types/app";
import { trpc } from "../utils/trpc";

const Settings: NextPage = () => {
  const [searchTerm, set_searchTerm] = useState("");
  const searchTermDebounced = useDebounce<string>(searchTerm, 500);
  const { data: userAndAffiliate, isFetching: isFetchingUser } =
    trpc.user.getUser.useQuery(undefined, {
      refetchOnWindowFocus: false,
    });
  return (
    <>
      <H1> User settings </H1>
      <div className="mt-10">
        {isFetchingUser ? (
          <div className="flex w-full items-center justify-center">
            <TailSpin className="h-12" />
          </div>
        ) : (
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Affiliate Box</span>
            </label>
            {/* <input
            className="input bg-base-200 placeholder:opacity-50"
            placeholder="Grace..."
            defaultValue=""
            {...register("name")}
          /> */}

            <div className="flex items-center">
              <input
                id="affiliate"
                disabled
                placeholder="Fetching..."
                value={
                  userAndAffiliate?.affiliate
                    ? `${(userAndAffiliate?.affiliate as Affiliate).name} (${
                        (userAndAffiliate?.affiliate as Affiliate).state
                      })`
                    : "No affiliate"
                }
                onChange={(e) => set_searchTerm(e.target.value)}
                className="input input-disabled left-0 w-full bg-base-200"
              />
              <label
                className="btn-ghost btn-sm btn absolute right-3 z-10"
                htmlFor="affiliate"
              >
                <MdDelete size={19} />
              </label>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Settings;
