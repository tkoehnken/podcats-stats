"use client";

import dynamic from "next/dynamic";
import type { ShowType } from "@/server/api/routers/spotify";

const Main = dynamic(
  () => import("./Main").then((mod) => mod.Main),
  { ssr: false },
);

export default function WrapMain(params: { show: Promise<ShowType> }) {
  return <Main show={params.show} />;
}
