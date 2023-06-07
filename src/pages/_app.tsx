import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { trpc } from "../utils/trpc";
import "../styles/globals.css";
import Layout from "../components/Layout/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  // const queryClient = new QueryClient({
  //   defaultOptions: {
  //     queries: {
  //       networkMode: "always",
  //     },
  //   },
  // });
  return (
    <SessionProvider session={session}>
      {/* <QueryClientProvider client={queryClient}> */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
      {/* </QueryClientProvider> */}
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
