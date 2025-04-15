import { MessageCircleIcon } from "lucide-react";

export const AppSidebarOpenMessage = () => {
  return (
    <a href="#">
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <MessageCircleIcon className="size-4" />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">Acme Inc</span>
        <span className="truncate text-xs">Enterprise</span>
      </div>
    </a>
  );
};
