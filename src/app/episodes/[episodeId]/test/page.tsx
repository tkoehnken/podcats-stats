import { getEpisode } from "@/server/api/routers/spotify";
import type { Metadata } from "next";
import { getExtraDataForEpisode } from "@/server/api/routers/google";
import { revalidateTag } from "next/cache";
import { Button } from "@/components/ui/button";

export async function generateStaticParams() {
  return [{ episodeId: "0oA9mMgWh1gEVeKAnuKKX5" }];
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
  const ep = await getExtraDataForEpisode(episodeId);

  async function refresh() {
    "use server";
    console.log("refreshing", episodeId);
    revalidateTag("episode-data" + episodeId);
    console.log("done", episodeId);
  }

  return (
    <main className="flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl">
        <h1>{ep?.date}</h1>
        <form action={refresh}>
          <Button type="submit">Reload</Button>
        </form>
      </div>
    </main>
  );
}
