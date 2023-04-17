import { MdLogin, MdMenu, MdOutlineArrowBackIosNew } from "react-icons/md";
import { TailSpin } from "react-loading-icons";
import AvatarButton from "../AvatarButton/AvatarButton";
import { signIn, signOut, useSession } from "next-auth/react";
import Logo from "./Logo";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HiMenuAlt2 } from "react-icons/hi";
import MainDrawer from "./Navigation/MainDrawer";

interface HeaderProps {
  h1:
    | {
        mobile?: string;
        desktop?: string;
      }
    | string;
  onGoBack?: () => void;
}

export default function Header({ h1, onGoBack }: HeaderProps) {
  const { data: sessionData, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [headerDiv, set_headerDiv] = useState<Element | null>();
  const [isDrawerOpen, set_isDrawerOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    set_headerDiv(document.querySelector("#header"));
    return () => setMounted(false);
  }, []);

  if (!headerDiv || !mounted) {
    return null;
  }

  const fadeIn = {
    initial: {
      y: -30,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
    },
    exit: {
      y: -30,
      opacity: 0,
    },
  };
  return (
    <>
      {isDrawerOpen && <MainDrawer onClose={() => set_isDrawerOpen(false)} />}
      <div className="mb-14 md:hidden">
        <motion.div
          className="fixed inset-x-0 top-0 z-50 flex h-14 w-full items-center justify-between border-b border-white border-opacity-5 bg-base-100 py-0 px-4 pr-2"
          {...fadeIn}
        >
          <div className="flex items-center gap-1">
            {onGoBack ? (
              <div
                onClick={onGoBack}
                className="flex cursor-pointer items-center gap-3 text-lg"
              >
                <MdOutlineArrowBackIosNew size={17} />{" "}
                <h1 className="h1 mobile flex items-center gap-2">
                  {typeof h1 === "object" ? h1.mobile : h1}{" "}
                </h1>
              </div>
            ) : (
              <>
                <button
                  onClick={() => set_isDrawerOpen(!isDrawerOpen)}
                  className="btn-ghost btn-md btn-circle btn"
                >
                  <HiMenuAlt2 className="text-primary" size={22} />
                </button>
                {/* <Logo /> */}
                <h1 className="h1 mobile flex items-center gap-3">
                  {typeof h1 === "object" ? h1.mobile : h1}
                </h1>
              </>
            )}
          </div>
          {status === "loading" ? (
            <>
              <div className="flex items-center gap-x-2">
                <TailSpin className="h-8" stroke="#2D68FF" speed={1.2} />{" "}
              </div>
            </>
          ) : (
            <>
              {!sessionData ? (
                <button
                  type="button"
                  onClick={() => signIn()}
                  className="btn-primary btn-sm btn my-2 flex gap-x-2"
                >
                  <MdLogin size="22px" />
                  Login
                </button>
              ) : (
                <AvatarButton />
              )}
            </>
          )}
        </motion.div>
      </div>
      <h1 className="h1 desktop">
        {typeof h1 === "object" ? h1.desktop : h1}{" "}
      </h1>
    </>
  );
}
