import { getAllShowInfos, getEpisode } from "@/server/api/routers/spotify";
import EpisodeEdit from "@/app/_components/episodeEdit";
import type { Metadata } from "next";
import { revalidateTag } from "next/cache";
import { db } from "@/server/firebase/util";
import type { InternalEpisode } from "@/server/api/routers/google";

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
}): Promise<Metadata> {
  const { episodeId } = await params;
  const ep = await getEpisode(episodeId);

  return {
    title: ep.name,
  };
}

type PageProps = {
  params: Promise<{ episodeId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { episodeId } = await params;
  const ep = await getEpisode(episodeId);

  const refreshAction = async () => {
    "use server";
    revalidateTag("episode");
  };

  const saveAction = async (input: { id: string } & InternalEpisode) => {
    "use server";
    await db.collection("episodes").doc(input.id).set(
      {
        books: input.books,
        guests: input.guests,
        types: input.types,
        introduction: input.introduction,
      },
      { merge: true },
    );
    revalidateTag("episode");
  };

  return (
    <main className="flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl">
        <EpisodeEdit
          episode={ep}
          refreshAction={refreshAction}
          saveAction={saveAction}
        />
        ;
      </div>
    </main>
  );
}
