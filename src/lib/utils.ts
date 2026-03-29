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

export const ListOfEpisodeTypes = ["classic", "guest", "preview"] as const;
export const ListOfBookTypes = ["main","preview","next"] as const;
export const ListOfSocials = ["youtube","twitch","x"] as const;