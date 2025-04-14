"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmailInput from "@/components/mail-input-message";
import { useState } from "react";
import { type SendMessageData } from "@/types/mail";
import { type User } from "@/types/user";

interface DialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
}

export const SendMessageDialog = ({
  open,
  setOpen,
  selectedUser,
  setSelectedUser,
}: DialogProps) => {
  const [messageData, setMessageData] = useState<SendMessageData>({
    title: "",
    message: "",
    file: null,
  });

  const handleChange = (key: keyof SendMessageData, value: any) => {
    setMessageData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={() => setSelectedUser(null)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            <div className="inline-flex items-center gap-2">
              <img
                src={selectedUser?.avatarURL}
                alt={selectedUser?.username}
                className="h-8 w-8 rounded-xl"
              />
              <span className="text-sm font-semibold">
                {selectedUser?.username}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            onChange={(e) => handleChange("title", e.target.value)}
            type="text"
            placeholder="Title"
          />
          <EmailInput
            handleChange={handleChange}
            message={messageData.message}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              className="cursor-pointer"
              type="button"
              variant="secondary"
            >
              Close
            </Button>
          </DialogClose>
          <Button
            className="cursor-pointer bg-[#1447e6] hover:bg-[#1447e6]/ text-white"
            type="submit"
          >
            Send message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
