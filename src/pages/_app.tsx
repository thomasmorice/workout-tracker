import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { usePromptNewVersion } from "../hooks/usePromptNewVersion";
import { trpc } from "../utils/trpc";
import "../styles/globals.css";
import "../styles/react-datepicker.css";
import Layout from "../components/Layout/Layout";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  usePromptNewVersion();

  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
