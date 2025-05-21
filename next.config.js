/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    reactCompiler: true,
    // DO not try again!!!!! Try old why first!!! I did it again
    dynamicIO: true,
    useCache: true
  },
  images: {
    remotePatterns: [{ hostname: "i.scdn.co" }],
  },
  logging: {
    fetches: {
      fullUrl: true,
    }
  }
};

export default config;
