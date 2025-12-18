// eslint.config.js
import next from "eslint-config-next/core-web-vitals"; // <= new import
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: [".next", ".vercel", "out"] },

  // Next.js recommended + core-web-vitals
  ...next,
  {
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
    },
  },
  // Global settings
  {
    linterOptions: { reportUnusedDisableDirectives: true },
    languageOptions: {
      parserOptions: { projectService: true },
    },
  },
);