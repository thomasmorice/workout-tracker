import withPWA from "next-pwa";
import currentGitBranchName from "current-git-branch";

const importWithPWA = withPWA({
  dest: "public",
  register: true,
  skipWaiting: false,
  disable: process.env.NODE_ENV === "development",
});

!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */
const config = importWithPWA({
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    domains: ["lh3.googleusercontent.com", "i.pravatar.cc"],
  },
  env: {
    GIT_BRANCH: currentGitBranchName(),
  },
  experimental: {
    // scrollRestoration: true,
  },
});
export default config;
