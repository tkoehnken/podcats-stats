import { getEpisode } from "@/server/api/routers/spotify";
import EpisodeEdit from "@/app/_components/episodeEdit";

export default async function Page({
  params,
}: {
  params: Promise<{ episodeId: string }>;
}) {
  const { episodeId } = await params;
  const ep = await getEpisode(episodeId);

  return (
    <main className="flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl">
        <EpisodeEdit data={ep} />
      </div>
    </main>
  );
}
