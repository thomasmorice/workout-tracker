import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";
import { MdLogin, MdOutlineMenuOpen, MdOutlineMenu } from "react-icons/md";
import { Rings } from "react-loading-icons";
import Logo from "../Logo";
import { NavigationItemsProps } from "./Navigation";
import { useSidebarStore } from "../../../store/SidebarStore";

export default function DesktopSidebar({ items }: NavigationItemsProps) {
  const ref = useRef(null);
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  const { isSidebarExpanded, setIsSidebarExpanded } = useSidebarStore();

  const classnames = {
    menuListItem:
      "btn btn-ghost cursor-pointer rounded-lg px-4 py-3 opacity-70 hover:opacity-90",
  };

  return (
    <>
      <aside
        ref={ref}
        className={`shadow-zinc-900-700 sidebar-shadow fixed z-50  h-full bg-base-100 pt-6 transition-all ${
          isSidebarExpanded ? "px-6" : "px-2"
        } `}
      >
        <div className={`${isSidebarExpanded ? "pt-5" : ""}`}>
          <Logo />
        </div>

        <div
          className={`divider opacity-60 ${isSidebarExpanded ? "py-8" : ""}`}
        ></div>

        <ul className="flex w-full flex-col gap-5 text-sm">
          {/* User */}

          {sessionData ? (
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
                      <a
                        className={`flex w-full items-center  gap-3 ${
                          isSidebarExpanded ? "" : "justify-center"
                        }`}
                      >
                        <>
                          <item.icon size="18px" />
                          {isSidebarExpanded && item.label}
                        </>
                      </a>
                    </li>
                  </Link>
                );
              })}

              <li
                onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                className={classnames.menuListItem}
              >
                <a className="flex w-full items-center gap-3">
                  <>
                    {isSidebarExpanded ? (
                      <>
                        <MdOutlineMenuOpen size="18px" /> Close
                      </>
                    ) : (
                      <MdOutlineMenu size="18px" />
                    )}
                  </>
                </a>
              </li>
            </>
          ) : status !== "loading" ? (
            <>
              <li className={classnames.menuListItem}>
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
            </>
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
