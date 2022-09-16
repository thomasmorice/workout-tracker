import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { MdLogin, MdOutlineSchedule } from "react-icons/md";
import { Rings } from "react-loading-icons";
import { useSidebarStore } from "../../../store/SidebarStore";
import { NavigationItemsProps } from "./Navigation";

export default function MobileNavbar({
  items,
  onOpenSidebar,
}: NavigationItemsProps) {
  const { data: sessionData, status } = useSession();
  const router = useRouter();

  const isLinkActive = useMemo(() => {
    return (path: string) => {
      return path === router.pathname;
    };
  }, [router]);

  return (
    <div
      style={{ boxShadow: "0px -1px 5px 0px rgba(0,0,0,0.3)" }}
      className="fixed bottom-0 z-40 flex w-full items-center rounded-t-xl bg-base-100 shadow-black drop-shadow-xl"
    >
      <>
        {items.map((item) => {
          return (
            <Link key={item.href} href={item.href}>
              <a
                className={`
                flex w-1/4 flex-col items-center gap-1 border-r border-base-200 px-4 py-2 text-xs transition-all duration-300
                ${
                  isLinkActive(item.href)
                    ? "rounded-t-lg bg-primary text-primary-content"
                    : ""
                }
              `}
              >
                <item.icon size="22px" />
                {item.label}
              </a>
            </Link>
          );
        })}
        <a
          onClick={onOpenSidebar}
          className={`
                flex w-1/4 flex-col items-center gap-1 border-r border-base-200 px-4 py-2 text-xs transition-all duration-300
              `}
        >
          <MdOutlineSchedule size="22px" />
          Activities
        </a>
      </>
    </div>
  );
}
