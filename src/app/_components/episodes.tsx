"use client";
import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

type EpisodesProps = {
  list: SpotifyApi.EpisodeObjectSimplified[];
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
  data: SpotifyApi.EpisodeObjectSimplified;
};

const Episode = (props: EpisodeProps) => {
  const img = props.data.images.reduce((prev, cur) =>
    !!prev.height && !!cur.height && cur.height < prev.height ? prev : cur,
  );

  return (
    <div className="hover:border-primary w-full rounded-xl border-2 border-transparent p-2 transition duration-300 ease-in-out">
      <Link href={`/episodes/${props.data.id}`}>
        <h3 className="text-2xl">{props.data.name}</h3>
      </Link>
      <div className="flex flex-row gap-1">
        <Image
          src={img.url}
          height={150}
          width={150}
          alt="Episode cover"
          className="h-37.5 w-37.5"
        />
        <article className="whitespace-pre-wrap">
          {props.data.description}
        </article>
      </div>
    </div>
  );
};

export default Episodes;
