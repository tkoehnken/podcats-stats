"use client";

import { List, useDynamicRowHeight } from "react-window";
import { type ShowType } from "@/server/api/routers/spotify";
import { use } from "react";
import Episode from "@/app/_components/episode";
import { useInfiniteLoader } from "react-window-infinite-loader";
import { api } from "@/trpc/react";
import { useSize } from "@/lib/size";

type MainProps = {
  show: Promise<ShowType>;
};

export function Main(props: MainProps) {
  const show = use(props.show);
  const dynamicRowHeight = useDynamicRowHeight({
    defaultRowHeight: 416,
  });
  useSize((size) => {
    const px = size === "lg" ? 416 : size === "md" ? 316 : 216;
    for (let i = 1; i < rows.length; i++) {
      dynamicRowHeight.setRowHeight(i, px);
    }
  });

  const { data, fetchNextPage, isFetchingNextPage } =
    api.episodes.episodes.useInfiniteQuery(
      { limit: 50 },
      {
        getNextPageParam: (lastPage) => lastPage.offset + lastPage.items.length,
        initialData: {
          pages: [{ ...show.episodes, offset: 0 }],
          pageParams: [show.episodes.items.length],
        },
        initialCursor: show.episodes.items.length,
        getPreviousPageParam: (lastPage) =>
          lastPage.offset - lastPage.items.length,
      },
    );

  const rows = [
    { type: "main" } as const,
    ...data.pages.flatMap((page) =>
      page.items.map((item) => ({ item, type: "episode" as const })),
    ),
  ];

  const onRowsLoaded = useInfiniteLoader({
    rowCount: show.episodes.total,
    isRowLoaded: (index) => {
      const firstPage = data.pages[0];
      const lastPage = data.pages[data.pages.length - 1];
      if (!firstPage || !lastPage) return false;
      return (
        index >= firstPage.offset &&
        index <= lastPage.offset + lastPage.items.length
      );
    },
    loadMoreRows: async () => {
      if (isFetchingNextPage) return;
      await fetchNextPage();
    },
  });

  return (
    <List
      onRowsRendered={onRowsLoaded}
      className="h-screen w-full"
      rowComponent={(props) => {
        const data = props.data[props.index];
        if (data?.type === "main") {
          return (
            <div
              style={props.style}
              className="container flex flex-col items-center justify-center gap-12 px-4 py-16"
            >
              <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
                {show.name}
              </h1>
            </div>
          );
        } else if (data?.type === "episode") {
          return (
            <div style={props.style}>
              <div className="flex w-full flex-1 justify-center">
                <div className="w-5xl">
                  <Episode data={data.item} />
                </div>
              </div>
            </div>
          );
        }
        return <div>Failed</div>;
      }}
      rowProps={{ data: rows }}
      rowHeight={dynamicRowHeight}
      rowCount={show.episodes.total + 1}
    />
  );
}
