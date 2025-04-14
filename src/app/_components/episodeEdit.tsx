"use client";
import { getBiggestImage } from "@/lib/utils";
import Image from "next/image";
import type { EpisodeType } from "@/server/api/routers/spotify";
import EpisodeTypeSelect from "@/components/EpisodeTypeSelect";
import { useState } from "react";
import type { EpisodeTypes } from "@/server/api/routers/google";

type EpisodeEditProps = {
  data: EpisodeType;
};

const EpisodeEdit = ({ data }: EpisodeEditProps) => {
  const img = getBiggestImage(data.images);
  const [episodeType, setEpisodeType] = useState<EpisodeTypes[]>(["classic"]);
  return (
    <div className="flex flex-row gap-1">
      <Image src={img.url} alt="Cover" height={400} width={400} />
      <div>
        <h1 className="text-xl">{data.name}</h1>
        <div className="max-w-400">
          <EpisodeTypeSelect values={episodeType} onChange={setEpisodeType} />
        </div>
        <p>{data.description}</p>
      </div>
    </div>
  );
};

export default EpisodeEdit;
