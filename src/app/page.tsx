import { getShowInfos } from "@/server/api/routers/spotify";
import { Suspense } from "react";
import WrapMain from "@/components/WrapMain";

export default async function Home() {
  const show = getShowInfos();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Suspense fallback={"Loading..."}>
        <WrapMain show={show} />
      </Suspense>
    </main>
  );
}
