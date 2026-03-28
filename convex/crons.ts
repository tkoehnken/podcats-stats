import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.weekly(
  "sync-spotify-episodes",
  { dayOfWeek: "friday", hourUTC: 12,minuteUTC: 0  }, // Every friday at 11
  internal.spotify.syncEpisodes,
);

export default crons;
