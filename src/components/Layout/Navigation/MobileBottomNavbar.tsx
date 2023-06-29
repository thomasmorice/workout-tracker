import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { NavigationItemsProps } from "./Navigation";
import FloatingActionButton from "../../FloatingActionButton/FloatingActionButton";

export default function MobileBottomNavbar({ items }: NavigationItemsProps) {
  const router = useRouter();

  const isLinkActive = useMemo(() => {
    return (path: string) => {
      return path === router.pathname;
    };
  }, [router]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex h-16 w-full items-center border-t border-t-white border-opacity-10 bg-base-100 text-xs">
      <>
        {items.map((item) => {
          if (!item.isFloatingActionButton) {
            return (
              <Link
                className={`flex h-full w-1/5 items-center justify-center rounded-full
          `}
                key={item.href}
                href={item.href}
              >
                <div
                  className={`rounded-full p-3 ${
                    isLinkActive(item.href)
                      ? " text-white"
                      : "text-base-content opacity-60"
                  }`}
                >
                  <item.icon
                    className={`${isLinkActive(item.href) ? "" : ""}`}
                    size={isLinkActive(item.href) ? 22 : 19}
                  />
                </div>

                {/* {isLinkActive(item.href) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                >
                  {item.label}
                </motion.div>
              )} */}
              </Link>
            );
          } else {
            return (
              <div
                key={"floating-action-button"}
                className="flex h-full w-1/5 items-center justify-center"
              >
                <FloatingActionButton />
              </div>
            );
          }
        })}
      </>
    </div>
  );
}
