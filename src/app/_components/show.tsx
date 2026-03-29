import { use } from "react";
import type { Doc } from "@/convex/_generated/dataModel";

type ShowProps = {
  show: Promise<Doc<"show">|null>;
}


export default function Show({show}: ShowProps) {
  const showData = use(show);


  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        {showData?.name}
      </h1>
    </div>
  );
  
  
}