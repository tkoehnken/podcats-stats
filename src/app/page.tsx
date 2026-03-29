import { Suspense } from "react";
import { preloadedQueryResult, preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Show from "@/app/_components/show";
import Episodes from "@/app/_components/episodes";

export default async function Home() {
  const show = preloadQuery(api.show.getShow).then(preloadedQueryResult);
  const episodes = preloadQuery(api.episodes.getAllEpisodes).then(
    preloadedQueryResult,
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Suspense fallback={"Loading..."}>
        <Show show={show} />
        <Episodes list={episodes} />
      </Suspense>
    </main>
  );
}
