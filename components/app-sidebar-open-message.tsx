"use client";
import { MessageCircleIcon } from "lucide-react";
import { useState } from "react";
import { SendMessageDialog } from "./dialogs/send-message-dialog";
import { SendMessageData } from "@/types/mail";
import { sendMail } from "@/actions/mail";

export const AppSidebarOpenMessage = () => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setIsOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
  };

  const handleSendMessage = async (messageData: SendMessageData) => {
    console.log("Sending message data:", messageData);
    const response = await sendMail(messageData);
    console.log(response);
  };

  return (
    <a href="#">
      <div
        onClick={handleOpenDialog}
        className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
      >
        <MessageCircleIcon className="size-4" />
      </div>
      <SendMessageDialog
        open={isOpenDialog}
        setOpen={setIsOpenDialog}
        selectedUser={null}
        handleSendMessage={handleSendMessage}
        setSelectedUser={handleCloseDialog}
      />
    </a>
  );
};
