/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    reactCompiler: true,
  },
  images: {
    remotePatterns: [{ hostname: "i.scdn.co" }],
  },
  i18n: {
    locales: ["de"],
    defaultLocale: "de"
  },
};

export default config;
