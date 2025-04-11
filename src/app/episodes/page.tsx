import {getAllShowInfos} from "@/server/api/routers/spotify";

export default async function Page() {
  const show = await getAllShowInfos();

  return (
    <div>
      <h1>{show.name}</h1>
      <ul>
        {show.episodes.map((item) => (
          <li key={item.id}>
              <h3>{item.name}</h3>
              <article>{item.description}</article>
          </li>
        ))}
      </ul>
    </div>
  );
}
