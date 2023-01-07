import { motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";
import Logo from "../Logo";
import { NavigationItemsProps } from "./Navigation";

export default function DesktopSidebar({ items }: NavigationItemsProps) {
  const ref = useRef(null);
  const { data: sessionData, status } = useSession();
  const router = useRouter();

  const classnames = {
    menuListItem:
      "btn btn-ghost cursor-pointer rounded-lg px-4 py-3 opacity-70 hover:opacity-90",
  };

  return (
    <>
      <aside
        ref={ref}
        className={`sidebar-shadow fixed z-50  h-full border-r pt-6  ${"px-2"} `}
      >
        <div>
          <Logo />
        </div>

        <div className={`divider opacity-60`}></div>

        <ul className="flex w-full flex-col gap-5 text-sm">
          {/* User */}

          {sessionData && (
            <>
              {items.map((item) => {
                const isSelected = item.href === router.asPath;
                return (
                  <Link key={item.href} href={item.href}>
                    <li
                      className={`btn  cursor-pointer rounded-lg  py-3
                ${
                  isSelected
                    ? "btn-primary py-3 text-primary-content opacity-100"
                    : "btn-ghost  opacity-70 hover:opacity-90"
                }`}
                    >
                      <div
                        className={`flex w-full items-center  justify-center gap-3`}
                      >
                        <>
                          <item.icon size="18px" />
                        </>
                      </div>
                    </li>
                  </Link>
                );
              })}
            </>
          )}
        </ul>
      </aside>
    </>
  );
}
