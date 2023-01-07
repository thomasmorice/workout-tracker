import { MdLogin, MdOutlineArrowBackIosNew } from "react-icons/md";
import { Rings } from "react-loading-icons";
import AvatarButton from "../AvatarButton/AvatarButton";
import { signIn, signOut, useSession } from "next-auth/react";
import Logo from "./Logo";

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
  return (
    <>
      <div className="mb-20 md:hidden">
        <div className="fixed inset-x-0 top-0 z-50 flex h-14 w-full items-center justify-between border-b border-white border-opacity-5 bg-base-100 py-0 px-4 pr-2 shadow-lg">
          <div className="flex items-center gap-3.5">
            {/* <Logo /> */}
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
              <h1 className="h1 mobile flex items-center gap-3">
                {typeof h1 === "object" ? h1.mobile : h1}
              </h1>
            )}
          </div>
          {status === "loading" ? (
            <>
              <div className="flex items-center gap-x-2">
                <Rings className="text-xl" />
              </div>
            </>
          ) : (
            <>
              {!sessionData ? (
                <button
                  type="button"
                  onClick={() => signIn()}
                  className="btn btn-primary my-2 flex gap-x-2"
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
      <h1 className="h1 desktop">
        {typeof h1 === "object" ? h1.desktop : h1}{" "}
      </h1>
    </>
  );
}
