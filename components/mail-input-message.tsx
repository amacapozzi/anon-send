"use client";
import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, X, Timer } from "lucide-react";
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

import type { SendMessageData } from "@/types/mail";
import { FormatButton } from "@/components/format-button";
import { Bold, Italic, Underline, List } from "lucide-react";
import { formatButtons } from "@/consts/formatActionts";

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
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      if (
        !editorRef.current.innerHTML ||
        editorRef.current.innerHTML === "<br>"
      ) {
        editorRef.current.innerHTML = message;
      }
    }
  }, [message]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        id: Math.random().toString(36).substring(7),
        name: file.name,
      }));
      setAttachments((prev) => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleEditorChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      handleChange("body", content);
    }
  };

  const applyFormat = (command: string) => {
    document.execCommand(command, false);
    if (editorRef.current) {
      editorRef.current.focus();
      handleEditorChange();
    }
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
                <span className="flex items-center gap-1">📄 {file.name}</span>
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

        <div
          ref={editorRef}
          id="message-textarea"
          contentEditable
          onInput={handleEditorChange}
          onBlur={handleEditorChange}
          className="min-h-[120px] p-3 outline-none overflow-auto"
          style={{ minHeight: "120px" }}
        />

        {/* Toolbar */}
        <div className="flex items-center gap-2 p-2 border-t">
          {/* Attach */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={handleAttachClick}
              >
                <Paperclip size={18} />
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

          {formatButtons.map(({ label, icon: Icon, command }) => (
            <FormatButton
              key={label}
              icon={<Icon size={18} />}
              label={label}
              onClick={() => applyFormat(command)}
            />
          ))}
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
