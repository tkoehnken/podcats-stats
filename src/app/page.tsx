import { getShowInfos } from "@/server/api/routers/spotify";
import { Suspense } from "react";
import WrapMain from "@/components/WrapMain";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export default async function Home() {
  const show = getShowInfos();
  const episodes = await preloadQuery(api.episodes.getAllEpisodes);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Suspense fallback={"Loading..."}>
        <WrapMain show={show} />
      </Suspense>
    </main>
  );
}
