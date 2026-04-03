import { Suspense } from "react";
import { preloadedQueryResult, preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Show from "@/app/_components/show";
import Episodes from "@/app/_components/episodes";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Home() {
  const show = preloadQuery(api.show.getShow).then(preloadedQueryResult);
  const episodes = preloadQuery(api.episodes.getAllEpisodes).then(
    preloadedQueryResult,
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <Suspense fallback={<Skeleton className="h-24 w-full" />}>
          <Show show={show} />
        </Suspense>
      </div>
      <div className="flex w-full max-w-3xl flex-1">
        <Suspense fallback={<div>Loading...</div>}>
          <Episodes list={episodes} />
        </Suspense>
      </div>
    </main>
  );
}
