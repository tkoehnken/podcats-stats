import { getShow } from "@/server/api/routers/spotify";

export default async function Page() {
  const show = await getShow();

  return (
    <div>
      <h1>{show.name}</h1>
      <ul>
        {show.episodes.items.map((item) => (
          <li key={item.id}>
              {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
