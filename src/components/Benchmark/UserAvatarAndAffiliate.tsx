import Image from "next/image";
import { trpc } from "../../utils/trpc";
import { TailSpin } from "react-loading-icons";
import { Affiliate } from "../../types/app";
import { useSession } from "next-auth/react";

export const UserAvatarAndAffiliate = () => {
  const { data: userAffiliate, isFetching: isFetchingUserAffiliate } =
    trpc.user.getUserAffiliate.useQuery(undefined, {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    });
  const { data: sessionData, status } = useSession();
  return (
    <div className="mt-6 flex flex-col items-center">
      <Image
        width={80}
        height={80}
        className="rounded-full ring ring-primary ring-offset-2 ring-offset-base-100"
        referrerPolicy="no-referrer"
        src={sessionData?.user?.image ?? "https://i.pravatar.cc/300"}
        alt=""
      />
      <div className="my-5 flex flex-col items-center justify-center font-bold">
        <p className="text-2xl">{sessionData?.user?.name}</p>
        <p className="text-xs">
          {isFetchingUserAffiliate ? (
            <TailSpin className="h-8" stroke="#2D68FF" speed={1.2} />
          ) : userAffiliate ? (
            `${(userAffiliate as Affiliate).name} @ ${
              (userAffiliate as Affiliate).state
            }`
          ) : (
            "No affiliate"
          )}
        </p>
      </div>
    </div>
  );
};

export default UserAvatarAndAffiliate;
