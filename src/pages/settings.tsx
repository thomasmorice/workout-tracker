import { inferRouterInputs } from "@trpc/server";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdDelete } from "react-icons/md";
import { TailSpin } from "react-loading-icons";
import { useDebounce } from "usehooks-ts";
import { UserRouterType } from "../server/trpc/router/user-router";

import H1 from "../components/H1/H1";
import { Affiliate } from "../types/app";
import { trpc } from "../utils/trpc";
import { useToastStore } from "../store/ToastStore";
import { useSession } from "next-auth/react";

const Settings: NextPage = () => {
  const utils = trpc.useContext();

  const { addMessage, closeMessage } = useToastStore();
  const { update: sessionUpdate } = useSession();

  const [searchTerm, set_searchTerm] = useState("");
  const searchTermDebounced = useDebounce<string>(searchTerm, 500);
  const { data: userAndAffiliate, isFetching: isFetchingUser } =
    trpc.user.getUser.useQuery(undefined, {
      refetchOnWindowFocus: false,
    });

  const { mutateAsync: editUser } = trpc.user.edit.useMutation({
    async onSuccess() {
      await utils.workout.getAllWorkoutWithResults.invalidate();
    },
  });

  const defaultValues: inferRouterInputs<UserRouterType>["edit"] = {
    gender: userAndAffiliate?.user?.gender,
  };

  const {
    register,
    getValues,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<inferRouterInputs<UserRouterType>["edit"]>({
    defaultValues,
  });

  useEffect(() => {
    setValue("gender", userAndAffiliate?.user?.gender);
  }, [isFetchingUser]);

  const onSubmit = async (user: inferRouterInputs<UserRouterType>["edit"]) => {
    try {
      await editUser({
        gender: user.gender,
      });
      sessionUpdate({
        gender: user.gender,
      });
      addMessage({
        type: "success",
        message: "Settings updated",
      });
    } catch (e) {
      console.log("error", e);
    }
  };

  watch("gender");
  return (
    <>
      <H1> User settings </H1>
      <div className="mt-2">
        {isFetchingUser ? (
          <div className="flex w-full items-center justify-center">
            <TailSpin className="h-12" />
          </div>
        ) : (
          <form
            className="mt-5 flex flex-col gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              console.log("e", e);
            }}
          >
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Affiliate Box</span>
              </label>

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
                  onClick={() => {
                    alert(
                      "unfortunately it is currently impossible to change the affiliate"
                    );
                  }}
                  className="btn-ghost btn-sm btn absolute right-5 z-10"
                  htmlFor="affiliate"
                >
                  <MdDelete size={19} />
                </label>
              </div>
            </div>

            <label className="label mt-3 w-fit">
              <span className="label-text">Gender</span>
              <span className="ml-2 text-xs opacity-60">
                used to create the athlete profile chart
              </span>
            </label>
            <div className="-mt-4 flex gap-4">
              <div className="form-control">
                <label className="label cursor-pointer gap-2">
                  <span className="label-text">Female</span>
                  <input
                    type="radio"
                    className="radio"
                    value={"FEMALE"}
                    {...register("gender")}
                    // checked={getValues("gender") === "FEMALE"}
                  />
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer gap-2">
                  <span className="label-text">Male</span>
                  <input
                    type="radio"
                    value={"MALE"}
                    className="radio"
                    {...register("gender")}
                  />
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer gap-2">
                  <span className="label-text">N/A</span>
                  <input
                    type="radio"
                    className="radio"
                    name="gender"
                    onChange={() => setValue("gender", null)}
                    checked={getValues("gender") === null}
                  />
                </label>
              </div>
            </div>
            <button
              onClick={async () => {
                await handleSubmit(onSubmit)();
              }}
              // disabled={!isDirty}
              className={`btn-primary btn mt-6`}
              type="button"
            >
              {`Save settings`}
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default Settings;
