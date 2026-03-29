import React from "react";

type BookCoverProps = {
  title: string;
  authors: string[];
  width?: number;
  height?: number;
  animated?: boolean;
  maxTitleCharsPerLine?: number;
};

const BookCover: React.FC<BookCoverProps> = ({
  title = "Test Title",
  authors = ["Me and you"],
  width = 300,
  height = 450,
  animated = false,
  maxTitleCharsPerLine = 20,
}) => {
  // Split title into lines based on character limit
  const wrapTitle = (text: string, maxChars: number): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    words.forEach((word) => {
      if ((currentLine + " " + word).trim().length <= maxChars) {
        currentLine += ` ${word}`;
      } else {
        lines.push(currentLine.trim());
        currentLine = word;
      }
    });

    if (currentLine) {
      lines.push(currentLine.trim());
    }

    return lines;
  };

  const titleLines = wrapTitle(title, maxTitleCharsPerLine);
  const titleFontSize = 18;
  const titleStartY = height / 2 - (titleLines.length * titleFontSize) / 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bgGradient" x1="0" y1="0" x2="1" y2="1">
          {animated ? (
            <>
              <stop offset="0%" stopColor="oklch(0.637 0.237 25.331)">
                <animate
                  attributeName="stop-color"
                  values="oklch(0.637 0.237 25.331);#1e293b;#0f172a;oklch(0.637 0.237 25.331)"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#0f172a">
                <animate
                  attributeName="stop-color"
                  values="#0f172a;#1e293b;oklch(0.637 0.237 25.331);#0f172a"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </stop>
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </>
          )}
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="100%" height="100%" fill="url(#bgGradient)" rx="16" />

      {/* Title (multiline) */}
      {titleLines.map((line, index) => (
          <text
              key={index}
              x="50%"
              y={titleStartY + index * (titleFontSize + 6)}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={titleFontSize}
              fill="#f1f5f9"
              fontFamily="'Georgia', serif"
              fontWeight="bold"
          >
            {line}
          </text>
      ))}

      {/* Authors */}
      {authors.map((author, index) => (
        <text
          key={index}
          x="50%"
          y={height - 40 - (authors.length - 1 - index) * 18}
          textAnchor="middle"
          fontSize="16"
          fill="#94a3b8"
          fontFamily="'Arial', sans-serif"
        >
          {author}
        </text>
      ))}
    </svg>
  );
};

export default BookCover;
