import { Suspense } from "react";
import { getEpisode } from "@/server/api/routers/spotify";
import EpisodeEdit from "@/app/_components/episodeEdit";

type PageProps = {
  params: Promise<{ episodeId: string }>;
};

export default function Page({ params }: PageProps) {
  return (
    <main className="flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl">
        <Suspense fallback={<p>Loading...</p>}>
          <SuspenseEpisode params={params} />
        </Suspense>
      </div>
    </main>
  );
}

async function SuspenseEpisode({
  params,
}: {
  params: Promise<{ episodeId: string }>;
}) {
  const { episodeId } = await params;
  const ep = await getEpisode(episodeId);
  return <EpisodeEdit episode={ep} />;
}
