import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-gradient-x-fast bg-gradient-dark rounded-2xl",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton }
