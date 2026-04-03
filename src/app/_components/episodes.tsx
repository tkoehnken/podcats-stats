"use client";
import Image from "next/image";
import { startTransition, Suspense, use, useState } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { getBiggestImage } from "@/lib/utils";
import Book from "@/components/Book";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { ViewTransition } from "react";
import type { FunctionReturnType } from "convex/server";
import type { api } from "@/convex/_generated/api";
import { useSearchParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

type ListOfEpisodes = FunctionReturnType<typeof api.episodes.getAllEpisodes>;
type Episode = ListOfEpisodes[number];

type EpisodesProps = {
  list: Promise<ListOfEpisodes>;
};

const Episodes = (props: EpisodesProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    startTransition(() => {
      router.replace(`?${params.toString()}`, { scroll: false });
    });
  }

  function handleSearch(value: string) {
    setSearchTerm(value);
    updateParams({ q: value });
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="sticky top-2 z-21 w-80 self-end">
        <Input
          value={searchTerm}
          placeholder="Search..."
          onChange={(event) => handleSearch(event.target.value)}
        />
      </div>
      <div className="mt-2.5 flex flex-1 flex-col gap-2.5">
        <Suspense fallback={<FakeEpisodes count={10} />}>
          <EpisodeList episodeList={props.list} />
        </Suspense>
      </div>
    </div>
  );
};

type EpisodeListProps = {
  episodeList: Promise<ListOfEpisodes>;
};

function EpisodeList({ episodeList }: EpisodeListProps) {
  const list = use(episodeList);
  const searchParams = useSearchParams();
  const items = list.filter((ep) => ep.spotifyData.name.includes(searchParams.get("q")??""));

  return items.map((item) => <Episode key={item.spotifyId} data={item} />);
}

type FakeEpisodesProps = {
  count: number;
};

function FakeEpisodes({ count }: FakeEpisodesProps) {
  return Array.from({ length: count }, (_, i) => i).map((i) => (
    <Skeleton
      key={i}
      className="w-full h-[245px]"
    />
  ));

}

type EpisodeProps = {
  data: Episode;
};

const Episode = (props: EpisodeProps) => {
  const img = getBiggestImage(props.data.spotifyData.images);
  const mainBook = props.data.books?.find(
    ({ inEpisodes }) =>
      inEpisodes.find((iep) => iep.episodeId === props.data._id)?.type ===
      "main",
  );
  const disabled = !props.data?.books || props.data.books.length === 0;

  return (
    <ViewTransition>
      <Collapsible
        disabled={disabled}
        className="hover:border-primary min-h-[225px] w-full rounded-xl border-2 border-transparent p-2 transition duration-300 ease-in-out data-[state=open]:backdrop-brightness-80 data-[state=open]:[&_.trigger-icon-down]:hidden data-[state=open]:[&_.trigger-icon-up]:block"
      >
        <CollapsibleTrigger>
          <div className="flex flex-row gap-2 text-left">
            <div className="flex min-w-[150px] flex-col justify-between">
              <ViewTransition name={`episode_cover_${props.data.spotifyId}`}>
                <Image
                  src={img.url}
                  height={150}
                  width={150}
                  alt="Episode cover"
                  className="h-37.5 w-37.5"
                  loading="lazy"
                />
              </ViewTransition>
              {!disabled ? (
                <>
                  <ChevronDownIcon className="trigger-icon-down h-5 w-5" />
                  <ChevronUpIcon className="trigger-icon-up hidden h-5 w-5" />
                </>
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href={`/episodes/${props.data.spotifyId}`}
                className="hover:underline"
              >
                <h3 className="text-2xl">{props.data.spotifyData.name}</h3>
              </Link>
              <article
                className="whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: props.data.spotifyData.description,
                }}
              />
            </div>
            <div className="min-h-[225px] min-w-[150px]">
              {mainBook ? <Book data={mainBook} width={150} /> : null}
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-5 grid auto-cols-min grid-cols-[repeat(3,150px)] justify-between gap-5 md:grid-cols-[repeat(4,150px)] lg:grid-cols-[repeat(6,150px)]"></div>
        </CollapsibleContent>
      </Collapsible>
    </ViewTransition>
  );
};

export default Episodes;
