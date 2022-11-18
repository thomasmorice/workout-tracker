import { MdLogin, MdOutlineKeyboardBackspace } from "react-icons/md";
import { Rings } from "react-loading-icons";
import AvatarButton from "../AvatarButton/AvatarButton";
import { signIn, signOut, useSession } from "next-auth/react";

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
      <div className=" mb-4 h-20 md:hidden">
        <div className="fixed inset-x-0 z-50 flex w-full items-center justify-between bg-base-100 py-0 px-4 pr-2 shadow-lg">
          <h1 className="h1 mobile flex items-center gap-2">
            {onGoBack && (
              <div onClick={onGoBack} className="text-lg">
                <MdOutlineKeyboardBackspace className="h-8 w-8" />{" "}
              </div>
            )}
            {typeof h1 === "object" ? h1.mobile : h1}{" "}
          </h1>
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
      <h1 className="h1 desktop mb-8">
        {typeof h1 === "object" ? h1.desktop : h1}{" "}
      </h1>
    </>
  );
}
