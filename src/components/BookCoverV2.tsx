import React from "react";

type BookCoverProps = {
  title: string,
  authors: string[],
  width?: number,
  height?: number,
  animated?: boolean,
  header?: React.ReactNode
};

const BookCover: React.FC<BookCoverProps> = ({
  title = "Test Title",
  authors = ["Me and you"],
  width = 300,
  height = 450,
  animated = false,
  header,
}) => {
  if (animated) {
    return (
      <BackgroundAnimated width={width} height={height}>
        <Info title={title} authors={authors} header={header} />
      </BackgroundAnimated>
    );
  }

  return (
    <Background width={width} height={height}>
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
  width: number;
  height: number;
  children: React.ReactNode;
};

const Background = (props: BackgroundProps) => (
  <div
    style={{
      maxWidth: props.width,
      height: props.height,
    }}
    className="bg-gradient-dark flex flex-col justify-between overflow-hidden rounded-2xl"
  >
    {props.children}
  </div>
);

const BackgroundAnimated = (props: BackgroundProps) => (
  <div
    style={{
      maxWidth: props.width,
      height: props.height,
    }}
    className="animate-gradient-x bg-gradient-dark flex flex-col justify-between overflow-hidden rounded-2xl"
  >
    {props.children}
  </div>
);
