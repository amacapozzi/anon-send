"use client";
import { MessageCircleIcon } from "lucide-react";
import { useState } from "react";
import { SendMessageDialog } from "./dialogs/send-message-dialog";

export const AppSidebarOpenMessage = () => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setIsOpenDialog(true);
  };

  return (
    <a href="#">
      <div
        onClick={handleOpenDialog}
        className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
      >
        <MessageCircleIcon className="size-4" />
      </div>
      <SendMessageDialog open={isOpenDialog} />
    </a>
  );
};
