import { getShowInfos, getEpisode } from "@/server/api/routers/spotify";
import Episode from "@/app/_components/episode";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const show = await getShowInfos();

  return show.episodes.map((ep) => ({
    episodeId: ep.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ episodeId: string }>;
}): Promise<Metadata> {
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
      <div className="w-full max-w-5xl">
        <Episode data={ep} />
      </div>
    </main>
  );
}
