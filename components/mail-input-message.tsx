"use client";

import type React from "react";
import { type SendMessageData } from "@/types/mail";

import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Paperclip,
  X,
  Bold,
  Italic,
  Underline,
  List,
  Timer,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Attachment {
  id: string;
  name: string;
}

interface EmailInputProps {
  message: string;
  handleChange: (key: keyof SendMessageData, value: any) => void;
}

export default function EmailInput({ message, handleChange }: EmailInputProps) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [expirationTime, setExpirationTime] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        id: Math.random().toString(36).substring(7),
        name: file.name,
      }));
      setAttachments([...attachments, ...newFiles]);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter((attachment) => attachment.id !== id));
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <TooltipProvider>
      <div className="rounded-lg border bg-background">
        {attachments.length > 0 && (
          <div className="p-2 flex flex-wrap gap-2">
            {attachments.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-1 bg-muted rounded-md py-1 px-2 text-sm text-muted-foreground"
              >
                <span className="flex items-center gap-1">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {file.name}
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => removeAttachment(file.id)}
                      className="ml-1 text-muted-foreground hover:text-foreground"
                    >
                      <X size={14} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete file</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            ))}
          </div>
        )}

        <Textarea
          value={message}
          onChange={(e) => handleChange("message", e.target.value)}
          placeholder="Type your message here..."
          className="min-h-[120px] border-0 focus-visible:ring-0 resize-none"
        />

        {/* Toolbar */}
        <div className="flex items-center gap-2 p-2 border-t">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={handleAttachClick}
              >
                <Paperclip size={18} />
                <span className="sr-only">Attach file</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Attach file</p>
            </TooltipContent>
          </Tooltip>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <Bold size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Bold</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <Italic size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Italic</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <Underline size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Underline</p>
            </TooltipContent>
          </Tooltip>

          {/* Timer icon with popover */}
          <Popover>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 rounded-full ${
                      expirationTime ? "text-primary" : ""
                    }`}
                  >
                    <Timer size={18} />
                    <span className="sr-only">Elimination time</span>
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Set elimination time</p>
              </TooltipContent>
            </Tooltip>
            <PopoverContent className="w-48 p-2" side="top" align="start">
              <div className="space-y-2">
                <p className="text-xs font-medium">Elimination time</p>
                <Select
                  value={expirationTime || ""}
                  onValueChange={setExpirationTime}
                >
                  <SelectTrigger className="w-full h-8 text-xs">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin tiempo</SelectItem>
                    <SelectItem value="5m">5 minutos</SelectItem>
                    <SelectItem value="1h">1 hora</SelectItem>
                    <SelectItem value="24h">24 horas</SelectItem>
                    <SelectItem value="7d">7 días</SelectItem>
                    <SelectItem value="30d">30 días</SelectItem>
                  </SelectContent>
                </Select>
                {expirationTime && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      The message will be deleted after {expirationTime}
                    </span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => setExpirationTime(null)}
                        >
                          <X size={12} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete time</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {expirationTime && (
          <div className="px-2 pb-2 flex items-center">
            <span className="text-xs text-primary flex items-center gap-1">
              <Timer size={12} />
              Message with elimination time: {expirationTime}
            </span>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
