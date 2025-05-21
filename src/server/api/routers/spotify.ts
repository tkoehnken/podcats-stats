import {
  type ExtraDataType,
  getExtraDataForEpisode,
} from "@/server/api/routers/google";

let authToken: string | undefined = undefined;

const baseURL = `https://api.spotify.com/v1/`;

const loadAuthToken = async (): Promise<void> => {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.SPOTIFY_CLIENT_ID +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET,
        ).toString("base64"),
    },
  });

  if (response.ok) {
    console.log("Successfully logged in spotify");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    authToken = (await response.json()).access_token;
    return;
  }
  console.error(
    "Unable to logged in spotify",
    response.status,
    response.statusText,
  );
};

const getAuthToken = async (): Promise<string> => {
  if (authToken) return authToken;
  await loadAuthToken();
  if (!authToken) throw new Error("Login failed.");
  return authToken;
};

type ShowPath = `shows/${string}`;

type Paths = ShowPath;

type GetPathResponse<T extends Paths> = T extends ShowPath
  ? SpotifyApi.ShowObject
  : never;

const rawSpotifyRequest = async (path: string): Promise<Response> => {
  const token = await getAuthToken();
  return await fetch(path, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const execSpotify = async <T extends Paths>(
  path: T,
): Promise<GetPathResponse<T>> => {
  const response = await rawSpotifyRequest(`${baseURL}${path}`);

  if (response.ok) {
    return (await response.json()) as GetPathResponse<T>;
  }
  throw new Error(
    `Failed request [${path}] (${response.status}): ${response.statusText}`,
  );
};

export const getShow = async (): Promise<SpotifyApi.ShowObject> => {
  const path: ShowPath = `shows/1MLK42q9YcHVVu8IM8cOdw`;
  return await execSpotify(path);
};

export type EpisodeType = SpotifyApi.EpisodeObjectSimplified & {
  extraData?: ExtraDataType & { date: number };
};

type ShowType = {
  name: string;
  images: SpotifyApi.ImageObject[];
  description: string;
  episodes: SpotifyApi.EpisodeObjectSimplified[];
  date: number;
};

const chunkArray = <T>(arr: T[], size = 10): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

export const enrichEpisodeData = async (
  episodes: SpotifyApi.EpisodeObjectSimplified[],
): Promise<EpisodeType[]> => {
  const moreData: EpisodeType[] = [...episodes];
  const chunkSize = 10;
  const chunks = chunkArray(moreData, chunkSize);
  for (let i = 0; i < chunks.length; ++i) {
    const chunk = chunks[i];
    if (chunk) {
      await Promise.all(
        chunk.map(async (_, index) => {
          const ep = moreData[index + i * chunkSize];
          if (ep) {
            ep.extraData = await getExtraDataForEpisode(ep.id);
          }
        }),
      );
    }
  }
  return moreData;
};

const loadSpotifyShowData = async () => {
  "use cache"
  const show = await getShow();
  //let episodeUrl = show.episodes.next;
  const episodes = show.episodes.items.slice(0, 1);
  /*while (episodeUrl !== null) {
    const ep = await rawSpotifyRequest(episodeUrl);
    if (!ep.ok)
      throw Error(`Failed ${episodeUrl} [${ep.status}]: ${ep.statusText}`);
    const epData = (await ep.json()) as SpotifyApi.ShowEpisodesResponse;
    episodes.push(...epData.items);
    episodeUrl = epData.next;
  }*/
  return {
    name: show.name,
    images: show.images,
    description: show.description,
    episodes,
    date: Date.now(),
  };
};

export const getAllShowInfos = async (): Promise<ShowType> => {
  const show = await loadSpotifyShowData();
  return {
    name: show.name,
    images: show.images,
    description: show.description,
    episodes: show.episodes,
    date: show.date,
  };
};

/**
 * Load all Episodes and search for id.
 * Its done this way to not have a request for each Episode if all the Episode data
 * is already in the cache.
 * @param id
 */
export const getEpisode = async (id: string): Promise<EpisodeType> => {
  const info = await getAllShowInfos();
  const episode = info.episodes.filter((ep) => ep.id === id);
  if (episode.length === 0) throw Error(`No episodes found with id ${id}`);
  const ep = episode[0];
  if (ep == undefined) throw Error(`No episodes found with id ${id}`);
  return {...ep,extraData: await getExtraDataForEpisode(ep.id)};
};
