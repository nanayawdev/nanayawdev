import { cn } from "@/lib/utils";
import { Spinner } from "@/components/admin/spinner";

export function LoadingState({ message, className }: { message?: string; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 p-12", className)}>
      <Spinner size="lg" />
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}
