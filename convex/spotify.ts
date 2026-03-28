import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

const SHOW_ID = "1MLK42q9YcHVVu8IM8cOdw";
const BASE_URL = "https://api.spotify.com/v1/";

type SpotifyEpisode = {
  id: string;
  name: string;
  html_description: string;
  release_date: string;
  duration_ms: number;
  images: Array<{ url: string }>;
};

type SpotifyEpisodesResponse = {
  items: SpotifyEpisode[];
  total: number;
  limit: number;
  offset: number;
};

const getAuthToken = async (): Promise<string> => {
  const credentials = btoa(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
  );
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body: new URLSearchParams({ grant_type: "client_credentials" }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Spotify auth failed: ${response.status} ${response.statusText}`);
  }
  const data = (await response.json()) as { access_token: string };
  return data.access_token;
};

export const syncEpisodes = internalAction({
  args: {},
  handler: async (ctx) => {
    const token = await getAuthToken();
    const episodeCount = await ctx.runQuery(internal.episodes.getEpisodeCount);

    let offset = episodeCount;
    let total: number | undefined;

    do {
      const url = `${BASE_URL}shows/${SHOW_ID}/episodes?offset=${offset}&limit=50`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`Spotify request failed: ${response.status} ${response.statusText}`);
      }
      const data = (await response.json()) as SpotifyEpisodesResponse;
      total = data.total;

      for (const episode of data.items) {
        await ctx.runMutation(internal.episodes.insertEpisodeFromSpotify, {
          spotifyId: episode.id,
          spotifyData: {
            name: episode.name,
            description: episode.html_description,
            releaseDate: episode.release_date,
            durationMs: episode.duration_ms,
            cover: episode.images[0]?.url ?? "",
          },
        });
      }

      offset += data.items.length;
    } while (total !== undefined && offset < total);

    console.log(`Synced ${offset - episodeCount} new episodes from Spotify.`);
  },
});
