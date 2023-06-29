import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function AvatarButton() {
  const { data: sessionData, status } = useSession();

  return (
    <>
      {status === "authenticated" && (
        <div className={`dropdown max-md:dropdown-end`}>
          {sessionData ? (
            <button
              className="btn-ghost btn-sm btn-circle btn relative flex overflow-hidden"
              type="button"
            >
              <Image
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
                src={sessionData.user?.image ?? "https://i.pravatar.cc/300"}
                alt=""
              />
            </button>
          ) : (
            <button onClick={() => signIn()} className="btn-primary btn">
              Login
            </button>
          )}

          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box w-52 bg-base-200 p-2 shadow"
          >
            <li>
              <Link href="/settings">Settings</Link>
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
