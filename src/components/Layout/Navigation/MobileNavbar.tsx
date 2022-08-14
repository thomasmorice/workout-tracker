import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { MdLogin } from "react-icons/md";
import { Rings } from "react-loading-icons";
import { NavigationItemsProps } from "./Navigation";

export default function MobileNavbar({ items }: NavigationItemsProps) {
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  return (
    <div
      style={{ boxShadow: "0px -1px 5px 0px rgba(0,0,0,0.3)" }}
      className="fixed bottom-0 z-50 flex w-full items-center rounded-t-xl bg-base-100 shadow-black drop-shadow-xl"
    >
      <>
        {items.map((item) => {
          const isActive = item.href === router.asPath;
          return (
            <Link key={item.href} href={item.href}>
              <a
                className={`
            flex w-1/4 flex-col items-center gap-1 border-r border-base-200 px-4 py-2 text-xs transition-all duration-300
            ${isActive ? "rounded-t-lg bg-primary text-primary-content" : ""}
          `}
              >
                <item.icon size="22px" />
                {item.label}
              </a>
            </Link>
          );
        })}
      </>
    </div>
  );
}
