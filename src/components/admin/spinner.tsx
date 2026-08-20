import { CircleNotchIcon as Loader2 } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "size-3",
  default: "size-4",
  lg: "size-6",
  xl: "size-8",
};

export function Spinner({
  size = "default",
  className,
}: {
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return <Loader2 className={cn("animate-spin text-muted-foreground", SIZES[size], className)} weight="duotone" />;
}
