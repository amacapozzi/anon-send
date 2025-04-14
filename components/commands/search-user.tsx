"use client";

import * as React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type User = {
  username: string;
  avatarURL: string;
};

const users: User[] = [
  {
    username: "FastOtter312",
    avatarURL: "https://api.dicebear.com/7.x/adventurer/svg?seed=FastOtter312",
  },
  {
    username: "CrazyFalcon891",
    avatarURL:
      "https://api.dicebear.com/7.x/adventurer/svg?seed=CrazyFalcon891",
  },
  {
    username: "EpicPanda007",
    avatarURL: "https://api.dicebear.com/7.x/adventurer/svg?seed=EpicPanda007",
  },
  {
    username: "SilentTiger456",
    avatarURL:
      "https://api.dicebear.com/7.x/adventurer/svg?seed=SilentTiger456",
  },
  {
    username: "CoolWolf229",
    avatarURL: "https://api.dicebear.com/7.x/adventurer/svg?seed=CoolWolf229",
  },
];

export function SearchUserCommandDialog() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [message, setMessage] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(query.toLowerCase())
  );

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setOpen(false); // cerrar el buscador
  };

  const handleSend = () => {
    console.log("Mensaje:", message);
    console.log("Archivo:", file);
    console.log("Para:", selectedUser);
    // aquí podrías llamar a una API o algo similar
    // limpiar estado
    setMessage("");
    setFile(null);
    setSelectedUser(null);
  };

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          onValueChange={(value) => setQuery(value)}
          placeholder="Type a user or search..."
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Users">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <CommandItem
                  key={user.username}
                  className="cursor-pointer"
                  onSelect={() => handleUserSelect(user)}
                >
                  <img
                    src={user.avatarURL}
                    alt={user.username}
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="ml-2">{user.username}</span>
                </CommandItem>
              ))
            ) : (
              <CommandItem disabled>No users found.</CommandItem>
            )}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Modal de mensaje */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enviar mensaje a {selectedUser?.username}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Textarea
              placeholder="Escribe tu mensaje..."
              value={message}
              onChange={(e: any) => setMessage(e.target.value)}
            />
            <Input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <Button onClick={handleSend} disabled={!message.trim()}>
              Enviar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
