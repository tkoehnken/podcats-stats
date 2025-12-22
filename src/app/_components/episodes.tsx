"use client";
import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { getBiggestImage } from "@/lib/utils";
import type { EpisodeType } from "@/server/api/routers/spotify";
import Book from "@/components/Book";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { ViewTransition } from "react";

type EpisodesProps = {
  list: EpisodeType[];
};

const Episodes = (props: EpisodesProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const items = props.list.filter(({ name }) => name.includes(searchTerm));

  return (
    <div className="flex flex-col">
      <div className="sticky top-2 w-80 self-end">
        <Input
          value={searchTerm}
          placeholder="Search..."
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>
      <div className="mt-2.5 flex flex-col gap-2.5">
        {items.map((item) => (
          <Episode key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
};

type EpisodeProps = {
  data: EpisodeType;
};

const Episode = (props: EpisodeProps) => {
  const img = getBiggestImage(props.data.images);
  const mainBook = props.data.extraData?.books?.find(({ types }) =>
    types?.includes("main"),
  );
  const disabled =
    !props.data.extraData?.books || props.data.extraData.books.length === 0;

  return (
    <Collapsible
      disabled={disabled}
      className="hover:border-primary min-h-[225px] w-full rounded-xl border-2 border-transparent p-2 transition duration-300 ease-in-out data-[state=open]:backdrop-brightness-80 data-[state=open]:[&_.trigger-icon-down]:hidden data-[state=open]:[&_.trigger-icon-up]:block"
    >
      <CollapsibleTrigger>
        <div className="flex flex-row gap-2 text-left">
          <div className="flex min-w-[150px] flex-col justify-between">
            <ViewTransition name="episode_cover">
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
              href={`/episodes/${props.data.id}`}
              className="hover:underline"
            >
              <h3 className="text-2xl">{props.data.name}</h3>
            </Link>
            <article className="whitespace-pre-wrap">
              {props.data.description}
            </article>
          </div>
          {mainBook ? <Book data={mainBook} width={150} /> : null}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-5 grid auto-cols-min grid-cols-[repeat(3,150px)] justify-between gap-5 md:grid-cols-[repeat(4,150px)] lg:grid-cols-[repeat(6,150px)]">
          {props.data.extraData?.books
            ?.filter(({ types }) => !types?.includes("main"))
            ?.map((book) => (
              <div key={book.id} className="w-[150px]">
                <Book data={book} width={150} />
              </div>
            ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default Episodes;
