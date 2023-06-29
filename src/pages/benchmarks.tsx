import { NextPage } from "next";
import Head from "next/head";
import BenchmarkOverview from "../components/Benchmark/BenchmarkOverview";
import BenchmarkDetails from "../components/Benchmark/BenchmarkDetails";
import UserAvatarAndAffiliate from "../components/Benchmark/UserAvatarAndAffiliate";
import Header from "../components/Layout/Header";

const Benchmarks: NextPage = () => {
  return (
    <>
      <Head>
        <>
          <title>Athlete benchmark details</title>
          <meta
            name="description"
            content="Show full details about the athlete"
          />
        </>

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header h1="Athlete details" />
      <div className="mt-8">
        <UserAvatarAndAffiliate />
        <BenchmarkOverview />
        <div className="mt-6 flex flex-col items-center"></div>
        <BenchmarkDetails />
      </div>
    </>
  );
};

export default Benchmarks;
