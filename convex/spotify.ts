import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

export const SHOW_ID = "1MLK42q9YcHVVu8IM8cOdw";
const BASE_URL = "https://api.spotify.com/v1/";

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


    const showResponse = await fetch(`${BASE_URL}shows/${SHOW_ID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const showData = (await showResponse.json()) as SpotifyApi.SingleShowResponse
    await ctx.runMutation(internal.show.setShow, {
      spotifyId: SHOW_ID,
      name: showData.name,
      description: showData.html_description,
      images: showData.images
    });


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
      const data = (await response.json()) as SpotifyApi.ShowEpisodesResponse;
      total = data.total;

      await ctx.runMutation(internal.episodes.insertEpisodeFromSpotify, {
        episodes: data.items
          .filter((item) => item !== null)
          .map((item) => ({
            spotifyId: item.id,
            spotifyData: {
              name: item.name,
              description: item.html_description,
              releaseDate: item.release_date,
              durationMs: item.duration_ms,
              images: item.images ?? [],
            },
          })),
      });

      offset += data.items.length;
    } while (total !== undefined && offset < total);

    console.log(`Synced ${offset - episodeCount} new episodes from Spotify.`);
  },
});
