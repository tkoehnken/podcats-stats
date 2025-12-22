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
type EpisodePath = `shows/${string}/episodes`;

type Paths = ShowPath | EpisodePath;

type GetPathResponse<T extends Paths> = T extends EpisodePath
  ? SpotifyApi.ShowEpisodesResponse
  : T extends ShowPath
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
  query?: Record<string, string>,
): Promise<GetPathResponse<T>> => {
  const response = await rawSpotifyRequest(
    `${baseURL}${path}${query ? "?" + new URLSearchParams(query).toString() : ""}`,
  );

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

export type EpisodeType = SpotifyApi.EpisodeObjectSimplified;

export type ShowType = {
  name: string;
  images: SpotifyApi.ImageObject[];
  description: string;
  episodes: {
    items: SpotifyApi.EpisodeObjectSimplified[];
    limit: number;
    total: number;
  };
  date: number;
};

const chunkArray = <T>(arr: T[], size = 10): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const loadSpotifyShowData = async () => {
  "use cache";
  const show = await getShow();
  console.log("SpotifyShowData", show);
  return {
    name: show.name,
    images: show.images,
    description: show.description,
    episodes: {
      items: show.episodes.items,
      total: show.episodes.total,
      limit: show.episodes.limit,
    },
    date: Date.now(),
  };
};

export const getShowInfos = async (): Promise<ShowType> => {
  const show = await loadSpotifyShowData();
  return {
    name: show.name,
    images: show.images,
    description: show.description,
    episodes: show.episodes,
    date: show.date,
  };
};

export const getMoreEpisodes = async (offset: number, limit: number) => {
  "use cache";
  const data = await execSpotify(`shows/1MLK42q9YcHVVu8IM8cOdw/episodes`, {
    offset: offset.toString(),
    limit: limit.toString(),
  });

  return {
    items: data.items,
    offset: data.offset,
    total: data.total,
    limit: data.limit,
  };
};

/**
 * Load all Episodes and search for id.
 * Its done this way to not have a request for each Episode if all the Episode data
 * is already in the cache.
 * @param id
 */
export const getEpisode = async (id: string): Promise<EpisodeType> => {
  /*const info = await getShowInfos();
  const episode = info.episodes.filter((ep) => ep.id === id);
  if (episode.length === 0) throw Error(`No episodes found with id ${id}`);
  const ep = episode[0];
  if (ep == undefined) throw Error(`No episodes found with id ${id}`);
  return {...ep,extraData: await getExtraDataForEpisode(ep.id)};*/
  throw new Error("Not implemented");
};
