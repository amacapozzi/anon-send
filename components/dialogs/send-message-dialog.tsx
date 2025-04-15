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
import { useEffect, useState } from "react";
import { type SendMessageData } from "@/types/mail";
import { type User } from "@/types/user";
import UserSelect from "@/components/user-select";
import UserMentionSelector from "@/components/user-select";

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

  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const users: User[] = [
    {
      id: "1",
      alias: "FastOtter312",
      avatarURL:
        "https://api.dicebear.com/7.x/adventurer/svg?seed=FastOtter312",
    },
    {
      id: "2",
      alias: "CrazyFalcon891",
      avatarURL:
        "https://api.dicebear.com/7.x/adventurer/svg?seed=CrazyFalcon891",
    },
    {
      id: "3",
      alias: "EpicPanda007",
      avatarURL:
        "https://api.dicebear.com/7.x/adventurer/svg?seed=EpicPanda007",
    },
    {
      id: "4",
      alias: "SilentTiger456",
      avatarURL:
        "https://api.dicebear.com/7.x/adventurer/svg?seed=SilentTiger456",
    },
    {
      id: "5",
      alias: "CoolWolf229",
      avatarURL: "https://api.dicebear.com/7.x/adventurer/svg?seed=CoolWolf229",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={() => setSelectedUser(null)}>
      <DialogContent className="sm:max-w-md font-[family-name:var(--font-geist-sans)]">
        <DialogHeader>
          <DialogTitle>New message</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <UserMentionSelector
            users={users}
            placeholder="Type @ to mention users..."
            selectedUsers={selectedUsers}
            onChange={setSelectedUsers}
          />
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
