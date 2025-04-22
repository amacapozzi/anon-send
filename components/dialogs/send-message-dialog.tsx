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
import { useEffect, useState, useMemo } from "react";
import UserMentionSelector from "@/components/user-select";
import { getPublicUsers } from "@/actions/users";
import { type SendMessageData } from "@/types/mail";
import { type User } from "@/types/user";

interface DialogProps {
  open: boolean;
  handleSendMessage: (messageData: SendMessageData) => void;
  setOpen: (open: boolean) => void;
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
}

export const SendMessageDialog = ({
  open,
  setOpen,
  handleSendMessage,
  selectedUser,
  setSelectedUser,
}: DialogProps) => {
  const [messageData, setMessageData] = useState<SendMessageData>({
    subject: "",
    body: "",
    file: null,
    recipients: [],
  });

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await getPublicUsers();
      setUsers(result as User[]);
    };
    fetchUsers();
  }, []);

  const selectedUsers = useMemo(
    () => users.filter((user) => messageData.recipients.includes(user.id)),
    [users, messageData.recipients]
  );

  const updateField = <K extends keyof SendMessageData>(
    key: K,
    value: SendMessageData[K]
  ) => {
    setMessageData((prev) => ({ ...prev, [key]: value }));
  };

  const handleUsersChange = (users: User[]) => {
    updateField(
      "recipients",
      users.map((u) => u.id)
    );
  };

  const handleClose = () => {
    setSelectedUser(null);
    setOpen(false);
  };

  const handleSubmit = () => {
    handleSendMessage(messageData);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md font-[family-name:var(--font-geist-sans)]">
        <DialogHeader>
          <DialogTitle>New message</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <UserMentionSelector
            users={users}
            selectedUsers={selectedUsers}
            onChange={handleUsersChange}
            placeholder="Type @ to mention users..."
          />
          <Input
            type="text"
            placeholder="Title"
            value={messageData.subject}
            onChange={(e) => updateField("subject", e.target.value)}
          />
          <EmailInput handleChange={updateField} message={messageData.body} />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            className="cursor-pointer bg-[#1447e6] hover:bg-[#1447e6]/50 text-white"
            type="submit"
          >
            Send message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
