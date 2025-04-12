import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBiggestImage(images: SpotifyApi.ImageObject[]){
  return images.reduce((prev, cur) =>
      !!prev.height && !!cur.height && cur.height < prev.height ? prev : cur,
  );
}
