//import "@types/spotify-api";

let authToken: string | undefined = undefined;

const baseURL = `https://api.spotify.com/v1/`;

const loadAuthToken = async (): Promise<void> => {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: new URLSearchParams({
      'grant_type': 'client_credentials',
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')),
    },
  });

  if (response.ok) {
    console.log("Successfully logged in spotify");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    authToken = (await response.json()).access_token;
    return;
  }
  console.error("Unable to logged in spotify",response.status,response.statusText);
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

const execSpotify = async <T extends Paths>(
  path: T,...cacheTags: string[]
): Promise<GetPathResponse<T>> => {
  const token = await getAuthToken();
  const response = await fetch(`${baseURL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: {tags: cacheTags},
    cache: "force-cache"
  });

  if (response.ok) {
    return (await response.json()) as GetPathResponse<T>;
  }
  throw new Error(
    `Failed request [${path}] (${response.status}): ${response.statusText}`,
  );
};

export const getShow = async (): Promise<SpotifyApi.ShowObject> => {
  const path: ShowPath = `shows/1MLK42q9YcHVVu8IM8cOdw`;
  return await execSpotify(path,"show");
};
