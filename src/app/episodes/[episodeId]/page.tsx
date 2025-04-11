import { getAllShowInfos, getEpisode } from "@/server/api/routers/spotify";

export async function generateStaticParams() {
  const show = await getAllShowInfos();

  return show.episodes.map((ep) => ({
    episodeId: ep.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ episodeId: string }>;
}) {
  const { episodeId } = await params;
  const ep = await getEpisode(episodeId);

  return {
    title: ep.name,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ episodeId: string }>;
}) {
  const { episodeId } = await params;
  const ep = await getEpisode(episodeId);

  return (
    <main className="flex flex-col items-center justify-center">
      <div className="max-w-5xl w-full">
        <h1>{ep.name}</h1>
      </div>
    </main>
  );
}
