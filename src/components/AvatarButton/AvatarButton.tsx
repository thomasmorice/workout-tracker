import Image from "next/image";
import { MdArrowDropDown } from "react-icons/md";
import { signIn, signOut, useSession } from "next-auth/react";
import { TailSpin } from "react-loading-icons";

type AvatarButtonProps = {};

export default function AvatarButton({}: AvatarButtonProps) {
  const { data: sessionData, status } = useSession();

  return (
    <>
      {status === "loading" ? (
        <div className="flex items-center gap-2">
          <TailSpin className="h-8" stroke="#2D68FF" speed={1.2} /> Fetching
          data
        </div>
      ) : (
        <div className={`dropdown max-md:dropdown-end`}>
          {sessionData ? (
            <button className="btn btn-ghost btn-circle" type="button">
              <Image
                width={32}
                height={32}
                className="rounded-full"
                referrerPolicy="no-referrer"
                src={sessionData.user?.image ?? "https://i.pravatar.cc/300"}
                alt=""
              />
              {/* <div className="flex items-center gap-1">
                  <MdArrowDropDown size={22} />
                </div> */}
            </button>
          ) : (
            <button onClick={() => signIn()} className="btn btn-primary">
              Login
            </button>
          )}

          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box w-52 bg-base-200 p-2 shadow"
          >
            <li>
              <a>Settings</a>
            </li>
            <li onClick={() => signOut()}>
              <a className="bg-error text-error-content">Log out</a>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
