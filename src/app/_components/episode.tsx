import Image from "next/image";
import { getBiggestImage } from "@/lib/utils";
import type { EpisodeType } from "@/server/api/routers/spotify";
import { unstable_ViewTransition as ViewTransition } from "react";
import BookCoverV2 from "@/components/BookCoverV2";

type EpisodeProps = {
  data: EpisodeType;
};

export default async function Episode({ data }: EpisodeProps) {
  const img = getBiggestImage(data.images);
  const mainBook = data.extraData?.books?.find(({ types }) =>
    types?.includes("main"),
  );
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-row gap-1">
        <ViewTransition name="episode_cover">
          <Image
            src={img.url}
            alt="Cover"
            height={400}
            width={400}
            className="min-w-[200px] md:min-w-[300px] lg:min-w-[400px]"
          />
        </ViewTransition>
        <div>
          <h1 className="text-xl">{data.name}</h1>
          <p>{data.description}</p>
          <div className="mt-4">
            {data.extraData ? <ExtraData {...data.extraData} /> : null}
          </div>
        </div>
      </div>
      <div>{mainBook ? <DisplayMainBook data={mainBook} /> : null}</div>
    </div>
  );
}

const ExtraData = (props: Required<EpisodeType>["extraData"]) => (
  <div>
    {props.introduction ? (
      <div>
        {props.introduction.anne ? (
          <Introduction name="Anne" introduction={props.introduction.anne} />
        ) : null}
        {props.introduction.fabienne ? (
          <Introduction
            name="Fabienne"
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
    <div>{props.name}:</div>
    <div>{props.introduction}</div>
  </div>
);

type DisplayMainBook = {
  data: Required<Required<EpisodeType>["extraData"]>["books"][number];
};

const DisplayMainBook = ({ data }: DisplayMainBook) => (
  <div className="flex flex-row gap-2">
    <BookCoverV2
      animated
      title={data.title}
      className="min-h-[300px] min-w-[200px] md:min-h-[450px] md:min-w-[300px] lg:min-h-[600px] lg:min-w-[400px] max-h-[300px] max-w-[200px] md:max-h-[450px] md:max-w-[300px] lg:max-h-[600px] lg:max-w-[400px]"
      authors={data.authors.map(
        ({ firstname, lastname }) => `${firstname} ${lastname}`,
      )}
    />
    <div className="flex flex-col gap-2">
      <h1 className="text-xl">{data.title}</h1>
      <h2 className="text-sm">{data.isbn}</h2>
      <div>
        {data.authors.map(
          ({ firstname, lastname }) => `${firstname} ${lastname}`,
        )}
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: data.description }}
        className="whitespace-pre-wrap"
      />
    </div>
  </div>
);
