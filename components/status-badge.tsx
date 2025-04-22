import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: "read" | "unread";
};

export function StatusBadge({ status }: StatusBadgeProps) {
  console.log(status);

  return (
    <Badge
      variant={status === "unread" ? "default" : "secondary"}
      className={cn(
        "ml-2 shrink-0 self-start text-xs font-normal",
        status === "unread" ? "bg-primary" : "bg-muted text-muted-foreground"
      )}
    >
      {status === "read" ? "Viewed" : "New"}
    </Badge>
  );
}
