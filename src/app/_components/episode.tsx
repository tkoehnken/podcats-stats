"use client";

import Image from "next/image";
import { getBiggestImage } from "@/lib/utils";

type EpisodeProps = {
  data: SpotifyApi.EpisodeObjectSimplified;
};

export default function Episode({ data }: EpisodeProps) {
  const img = getBiggestImage(data.images);
  return (
    <div className="flex flex-row gap-1">
      <Image src={img.url} alt="Cover" height={400} width={400} />
      <div>
        <h1 className="text-xl">{data.name}</h1>
        <p>{data.description}</p>
      </div>
    </div>
  );
}
