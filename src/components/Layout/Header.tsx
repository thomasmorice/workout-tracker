import { MdLogin, MdMenu, MdOutlineArrowBackIosNew } from "react-icons/md";
import AvatarButton from "../AvatarButton/AvatarButton";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { IoMdApps } from "react-icons/io";
import MainDrawer from "./Navigation/MainDrawer";
import Image from "next/image";
import useScrollPosition from "../../hooks/useScrollPosition";
import { AnimatePresence, motion } from "framer-motion";

interface HeaderProps {
  h1: string;
  onGoBack?: () => void;
}

export default function Header({ h1, onGoBack }: HeaderProps) {
  const { data: sessionData, status } = useSession();
  const [isDrawerOpen, set_isDrawerOpen] = useState(false);
  const [isH1Condensed, set_isH1Condensed] = useState(false);
  const scrollPosition = useScrollPosition();

  useEffect(() => {
    if (scrollPosition.y > 12) {
      set_isH1Condensed(true);
    } else {
      set_isH1Condensed(false);
    }
  }, [scrollPosition.y]);

  const h1Variants = {
    visible: { opacity: 1, transition: { duration: 0.3 } },
    hidden: { opacity: 0, transition: { duration: 0 } },
  };

  return (
    <>
      {isDrawerOpen && <MainDrawer onClose={() => set_isDrawerOpen(false)} />}
      <div className=" mb-14 md:hidden">
        <div className="fixed inset-0 -z-50 h-60 opacity-10 blur-3xl">
          <Image
            fill
            alt="header background"
            src="/blurry-gradient.svg"
            className="object-cover"
          />
        </div>
        <div className="fixed inset-x-0 top-0 z-50 flex h-12 w-full items-center justify-between px-2 py-0 backdrop-blur-sm">
          <div className="flex items-center gap-1">
            {onGoBack ? (
              <div
                onClick={onGoBack}
                className="flex cursor-pointer items-center gap-3 text-lg"
              >
                <MdOutlineArrowBackIosNew size={17} />

                <h1 className="flex w-fit text-lg font-semibold">{h1}</h1>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => set_isDrawerOpen(!isDrawerOpen)}
                  className="btn-ghost btn-sm btn-circle btn"
                >
                  <IoMdApps size={25} className="text-base-content" />
                </button>
                <AnimatePresence>
                  {isH1Condensed && (
                    <motion.h1
                      variants={h1Variants}
                      initial="hidden"
                      animate="visible"
                      className="flex w-fit pt-1 text-sm font-bold uppercase"
                    >
                      {h1}
                    </motion.h1>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
          {status === "loading" ? (
            <>
              <span className="loading loading-infinity loading-md"></span>
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
        </div>
      </div>
      <div className="h-6">
        <AnimatePresence>
          {!isH1Condensed && (
            <motion.h1
              variants={h1Variants}
              initial="hidden"
              animate="visible"
              className="text-2xl font-black"
            >
              {h1}
            </motion.h1>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
