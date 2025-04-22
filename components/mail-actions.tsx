"use client";

import { Reply, Forward, Trash, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MailActions() {
  return (
    <div className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Reply className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Forward className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Trash className="h-5 w-5" />
        </Button>
      </div>
      <Button variant="ghost" size="icon">
        <MoreHorizontal className="h-5 w-5" />
      </Button>
    </div>
  );
}
