import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";
import { MdLogin, MdLogout } from "react-icons/md";
import { Rings } from "react-loading-icons";
import Logo from "../Logo";
import { NavigationItemsProps } from "./Navigation";
import Image from "next/image";

export default function DesktopSidebar({ items }: NavigationItemsProps) {
  const ref = useRef(null);
  const { data: sessionData, status } = useSession();
  const router = useRouter();

  return (
    <>
      <aside
        ref={ref}
        className="fixed  z-50 h-full w-[320px] rounded-r-2xl bg-base-100 px-8 pt-8 shadow-2xl  shadow-base-300"
      >
        <Logo />

        <div className="divider px-8 py-4 opacity-60"></div>

        <ul className="flex w-full flex-col gap-5 pt-2 text-sm">
          {/* User */}

          {sessionData ? (
            <>
              <div className="flex items-center gap-4">
                <div className="mask mask-circle h-14 w-14 relative">
                  <Image
                    layout="fill"
                    referrerPolicy="no-referrer"
                    src={sessionData.user?.image ?? "https://i.pravatar.cc/300"}
                    alt=""
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <div className="text-[16px] font-semibold leading-4 text-base-content opacity-80">
                    Thomas M.
                  </div>
                  <div className="text-sm font-light opacity-60">
                    @thomasmorice
                  </div>
                </div>
              </div>

              {items.map((item) => {
                const isSelected = item.href === router.asPath;
                return (
                  <Link key={item.href} href={item.href}>
                    <li
                      className={`btn  cursor-pointer rounded-lg px-4 py-3
                ${
                  isSelected
                    ? "btn-primary py-3 text-primary-content opacity-100"
                    : "btn-ghost  opacity-70 hover:opacity-90"
                }`}
                    >
                      <a className="flex w-full items-center gap-3">
                        <>
                          <item.icon size="18px" /> {item.label}
                        </>
                      </a>
                    </li>
                  </Link>
                );
              })}
              <li
                className={`btn  btn-ghost cursor-pointer rounded-lg px-4 py-3  opacity-70 hover:opacity-90`}
              >
                <a
                  onClick={() => signOut()}
                  className="flex w-full items-center gap-3"
                >
                  <>
                    <MdLogout size="18px" />
                    Sign out
                  </>
                </a>
              </li>
            </>
          ) : status !== "loading" ? (
            <li
              className={`btn  btn-ghost cursor-pointer rounded-lg px-4 py-3  opacity-70 hover:opacity-90`}
            >
              <a
                onClick={() => signIn()}
                className="flex w-full items-center gap-3"
              >
                <>
                  <MdLogin size="18px" />
                  Login
                </>
              </a>
            </li>
          ) : (
            <div className="flex items-center gap-x-2">
              <Rings />
              Loading data...
            </div>
          )}
        </ul>
      </aside>
    </>
  );
}
