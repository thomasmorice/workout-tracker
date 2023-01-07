import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { MdOutlineSchedule } from "react-icons/md";
import { NavigationItemsProps } from "./Navigation";
import { motion } from "framer-motion";

export default function MobileBottomNavbar({ items }: NavigationItemsProps) {
  const router = useRouter();

  const isLinkActive = useMemo(() => {
    return (path: string) => {
      return path === router.pathname;
    };
  }, [router]);

  return (
    <div
      // style={{ boxShadow: "0px -1px 5px 0px rgba(0,0,0,0.3)" }}
      className="fixed inset-x-0 bottom-0 z-50 flex h-14 w-full items-center border-t border-t-white border-opacity-10 bg-base-100 text-xs"
    >
      <>
        {items.map((item) => {
          return (
            <Link
              className={`flex h-full w-1/4 flex-col items-center justify-center gap-0.5 
            ${
              isLinkActive(item.href)
                ? "bg-primary text-primary-content"
                : "text-neutral-content "
            }
          `}
              key={item.href}
              href={item.href}
            >
              <item.icon size={18} />

              {isLinkActive(item.href) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                >
                  {item.label}
                </motion.div>
              )}
            </Link>
          );
        })}
        <Link
          className={`flex h-full w-1/4 flex-col items-center justify-center gap-0.5
                    
                    ${
                      isLinkActive("/activities")
                        ? "bg-primary text-primary-content"
                        : "text-neutral-content"
                    }
                  `}
          href={"/activities"}
        >
          <MdOutlineSchedule size={18} />

          {isLinkActive("/activities") && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
            >
              Activities
            </motion.div>
          )}
        </Link>
      </>
    </div>
  );
}
