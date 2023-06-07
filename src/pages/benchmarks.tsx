import { NextPage } from "next";
import Head from "next/head";
import H1 from "../components/H1/H1";
import BenchmarkOverview from "../components/Benchmark/BenchmarkOverview";
import BenchmarkDetails from "../components/Benchmark/BenchmarkDetails";
import UserAvatarAndAffiliate from "../components/Benchmark/UserAvatarAndAffiliate";

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

      <H1> Athlete details </H1>
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
