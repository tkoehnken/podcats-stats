"use client";

import Image from "next/image";
import { getBiggestImage } from "@/lib/utils";
import type { EpisodeType } from "@/server/api/routers/spotify";

type EpisodeProps = {
  data: EpisodeType;
};

export default function Episode({ data }: EpisodeProps) {
  const img = getBiggestImage(data.images);
  return (
    <div className="flex flex-row gap-1">
      <Image src={img.url} alt="Cover" height={400} width={400} />
      <div>
        <h1 className="text-xl">{data.name}</h1>
        <p>{data.description}</p>
        {data.extraData ? <ExtraData {...data.extraData} /> : null}
      </div>
    </div>
  );
}

const ExtraData = (props: Required<EpisodeType>["extraData"]) => (
  <div>
    {props.introduction ? (
      <div>
        {props.introduction.anne ? (
          <Introduction name="anne" introduction={props.introduction.anne} />
        ) : null}
        {props.introduction.fabienne ? (
          <Introduction
            name="fabienne"
            introduction={props.introduction.fabienne}
          />
        ) : null}
      </div>
    ) : null}
  </div>
);

type Introduction = {
  name: string;
  introduction: string;
};

const Introduction = (props: Introduction) => (
  <div className="flex flex-row gap-1">
    <div>{props.name}</div>
    <div>{props.introduction}</div>
  </div>
);
