import { getExtraDataForEpisode } from "@/server/api/routers/google";
import { revalidateTag } from "next/cache";
import { Button } from "@/components/ui/button";

export async function generateStaticParams() {
  return [{ episodeId: "59Zj4rQAH3wWa9eAxlM9Wx" }];
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
    revalidateTag("episode");
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
