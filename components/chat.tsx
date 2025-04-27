"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  X,
  ImageIcon,
  File,
  Check,
  CheckCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import type { Message } from "@/types/message";
import type { User } from "@/types/user";
import { wasMessageRead } from "@/utils/message";

interface ChatProps {
  initialMessages: Message[];
  user: User;
}

export default function Chat({ initialMessages, user }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  messages.forEach((msg) => {
    console.log(
      msg.recipients.map((r) => {
        console.log(r.read);
      })
    );
  });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);
    }
  };

  const removeFiles = () => {
    setFiles(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() === "" && (!files || files.length === 0)) return;

    const attachments = files
      ? Array.from(files).map((file, index) => ({
          id: `new-att-${Date.now()}-${index}`,
          name: file.name,
          type: file.type,
          url: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : "/placeholder.svg?height=50&width=50",
        }))
      : undefined;

    setInput("");
    removeFiles();
  };

  // Determinar si un mensaje es del usuario actual
  const isCurrentUser = (senderId: string) => senderId === user.id;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              isCurrentUser(message.sender.id) ? "justify-end" : "justify-start"
            } mb-4`}
          >
            {!isCurrentUser(message.sender.id) && (
              <Avatar className="h-8 w-8 mt-1 mr-2">
                {message.sender.avatar ? (
                  <Image
                    src={message.sender.avatar || "/placeholder.svg"}
                    alt={message.sender.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-500">
                    {message.sender.alias.charAt(0)}
                  </div>
                )}
              </Avatar>
            )}

            <div className="flex flex-col max-w-[80%]">
              <div
                className={`p-3 rounded-2xl ${
                  isCurrentUser(message.sender.id)
                    ? "bg-orange-500 text-white rounded-tr-none"
                    : "bg-gray-200 text-gray-800 rounded-tl-none"
                }`}
              >
                <p className="text-sm">{message.body}</p>
              </div>

              <div
                className={`flex items-center gap-1 mt-2 ${
                  isCurrentUser(message.sender.id)
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <span className="text-xs text-gray-500">
                  {formatTime(new Date(message.createdAt))}
                </span>
                {isCurrentUser(message.sender.id) && wasMessageRead(message) ? (
                  <CheckCheck className="w-4 h-4 text-gray-400" />
                ) : (
                  <Check className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>

            {isCurrentUser(message.sender.id) && (
              <Avatar className="h-8 w-8 mt-1 ml-2">
                {message.sender.avatar ? (
                  <Image
                    src={message.sender.avatar || "/placeholder.svg"}
                    alt={message.sender.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-orange-500">
                    {message.sender.alias.charAt(0)}
                  </div>
                )}
              </Avatar>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {files && files.length > 0 && (
        <div className="px-4 py-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Archivos adjuntos: {files.length}
            </span>
            <Button variant="ghost" size="sm" onClick={removeFiles}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {Array.from(files).map((file, index) => (
              <div
                key={index}
                className="flex items-center p-2 bg-gray-100 rounded-md"
              >
                {file.type.startsWith("image/") ? (
                  <ImageIcon className="h-4 w-4 mr-2 text-gray-500" />
                ) : (
                  <File className="h-4 w-4 mr-2 text-gray-500" />
                )}
                <span className="text-sm truncate max-w-[150px]">
                  {file.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-3 border-t bg-white">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-gray-500"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-5 w-5" />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
            />
          </Button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Escribe un mensaje..."
              className="w-full py-2 px-4 bg-gray-100 rounded-full focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <Button
            type="submit"
            size="icon"
            className={`rounded-full ${
              input.trim() || (files && files.length > 0)
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-gray-200"
            }`}
            disabled={input.trim() === "" && (!files || files.length === 0)}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
