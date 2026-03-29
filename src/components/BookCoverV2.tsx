import React from "react";
import { cn } from "@/lib/utils";

type BookCoverProps = {
  title: string,
  authors: string[],
  animated?: boolean,
  header?: React.ReactNode,
  className: string
};

const BookCover: React.FC<BookCoverProps> = ({
  title = "Test Title",
  authors = ["Me and you"],
  animated = false,
  header,
  className
}) => {
  if (animated) {
    return (
      <BackgroundAnimated className={className}>
        <Info title={title} authors={authors} header={header} />
      </BackgroundAnimated>
    );
  }

  return (
    <Background className={className}>
      <Info title={title} authors={authors} header={header} />
    </Background>
  );
};

export default BookCover;

type InfoProps = {
  title: string,
  authors: string[],
  header?: React.ReactNode
};

const Info = (props: InfoProps) => (
  <>
    {props.header ?? <div></div>}
    <div className="flex flex-1/3 items-center justify-center p-2 text-center text-xl hyphens-auto">
      {props.title}
    </div>
    <div className="flex flex-1/3 items-end justify-center p-1 text-sm">
      {props.authors.join("; ")}
    </div>
  </>
);

type BackgroundProps = {
  children: React.ReactNode;
  className: string;
};

const Background = (props: BackgroundProps) => (
  <div
    className={cn(props.className,"bg-gradient-dark flex flex-col justify-between overflow-hidden rounded-2xl")}
  >
    {props.children}
  </div>
);

const BackgroundAnimated = (props: BackgroundProps) => (
  <div
    className={cn(props.className,"animate-gradient-x bg-gradient-dark flex flex-col justify-between overflow-hidden rounded-2xl")}
  >
    {props.children}
  </div>
);
