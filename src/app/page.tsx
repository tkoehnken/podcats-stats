import { enrichEpisodeData, getAllShowInfos } from "@/server/api/routers/spotify";
import Episodes from "@/app/_components/episodes";

export default async function Home() {

  const show = await getAllShowInfos();
  const episodes = await enrichEpisodeData(show.episodes);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          {show.name}
        </h1>
      </div>
      <div className="max-w-5xl w-full">
        <Episodes list={episodes} />
      </div>
    </main>
  );
}
