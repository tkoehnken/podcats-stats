import { useLayoutEffect, useState } from "react";

function getSize() {
  const width = window.innerWidth;
  if (width > 1024) {
    return "lg";
  } else if (width > 768) {
    return "md";
  } else {
    return "sm";
  }
}

export function useSize(onSizeChange?: (size: "sm" | "md" | "lg") => void) {
  const [size, setSize] = useState<"sm" | "md" | "lg">(getSize());

  useLayoutEffect(() => {
    const abortController = new AbortController();
    window.addEventListener(
      "resize",
      () => {
        const size = getSize();
        setSize(size);
        onSizeChange?.(size);
      },
      { signal: abortController.signal },
    );

    return () => {
      abortController.abort();
    };
  }, []);

  return size;
}
