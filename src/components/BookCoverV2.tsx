import React from "react";

type BookCoverProps = {
  title: string;
  authors: string[];
  width?: number;
  height?: number;
  animated?: boolean;
  header?: React.ReactNode;
};

const BookCover: React.FC<BookCoverProps> = ({
  title = "Test Title",
  authors = ["Me and you"],
  width = 300,
  height = 450,
  animated = false,
  header,
}) => {
  return (
    <div
      style={{
        width,
        height,
      }}
      className="flex animate-gradient-x bg-gradient-dark flex-col justify-between overflow-hidden rounded-2xl"
    >
      {header ?? <div></div>}
      <div className="flex flex-1/3 items-center justify-center p-2 text-center text-xl hyphens-auto">
        {title}
      </div>
      <div className="flex flex-1/3 items-end justify-center p-1 text-sm">
        {authors.join("; ")}
      </div>
    </div>
  );
};

export default BookCover;
