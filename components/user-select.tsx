"use client"; // This directive is needed for interactive components [^1]

import type React from "react";

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Badge } from "./ui/badge";

// Define the User type if not already imported
interface User {
  id: string;
  alias: string;
  name?: string;
  avatar?: string;
}

interface UserMentionSelectorProps {
  users: User[];
  selectedUsers: User[];
  onChange: (users: User[]) => void;
  placeholder?: string;
}

export default function UserMentionSelector({
  users,
  selectedUsers,
  onChange,
  placeholder = "Type @ to mention users...",
}: UserMentionSelectorProps) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMentioning, setIsMentioning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter users based on input after @ symbol
  const getMentionText = () => {
    if (!isMentioning) return "";
    return inputValue.substring(inputValue.lastIndexOf("@") + 1);
  };

  const mentionText = getMentionText();

  const filteredUsers = isMentioning
    ? users.filter(
        (user) =>
          !selectedUsers.some((selected) => selected.id === user.id) &&
          (user.alias.toLowerCase().includes(mentionText.toLowerCase()) ||
            user.name?.toLowerCase().includes(mentionText.toLowerCase()))
      )
    : [];

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Check if we're in mention mode
    if (value.includes("@")) {
      setIsMentioning(true);
      setIsOpen(true);
      setActiveIndex(0);
    } else {
      setIsMentioning(false);
      setIsOpen(false);
    }
  };

  // Handle selecting a user
  const handleSelectUser = (user: User) => {
    onChange([...selectedUsers, user]);

    // Reset the input and mention state
    setInputValue("");
    setIsMentioning(false);
    setIsOpen(false);

    // Focus back on input
    inputRef.current?.focus();
  };

  // Handle removing a user
  const handleRemoveUser = (userId: string) => {
    onChange(selectedUsers.filter((user) => user.id !== userId));
    inputRef.current?.focus();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < filteredUsers.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredUsers.length > 0 && activeIndex >= 0) {
          handleSelectUser(filteredUsers[activeIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setIsMentioning(false);
        break;
      case "@":
        setIsMentioning(true);
        setIsOpen(true);
        setActiveIndex(0);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Scroll active item into view
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const activeElement = dropdownRef.current.querySelector(
        `[data-index="${activeIndex}"]`
      );
      if (activeElement) {
        activeElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex, isOpen]);

  return (
    <div className="relative w-full font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-wrap items-center gap-1 p-2 border bg-[#141416] placeholder:text-muted-foreground text-muted-foreground rounded-md min-h-10 focus-within:ring-">
        <span className="text-sm text-muted-foreground">Recipients:</span>
        {selectedUsers.map((user) => (
          <Badge
            variant={"secondary"}
            key={user.id}
            className="flex items-center border border-gray-500/20 gap-1 px-2 py-1 text-smounded-full"
          >
            @{user.alias}
            <button
              type="button"
              onClick={() => handleRemoveUser(user.id)}
              className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-black/70 border"
              aria-label={`Remove ${user.alias}`}
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (isMentioning) setIsOpen(true);
          }}
          className="flex-1 min-w-[120px] outline-none text-sm"
          placeholder={selectedUsers.length === 0 ? placeholder : ""}
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls={isOpen ? "user-mention-list" : undefined}
          aria-activedescendant={
            isOpen && activeIndex >= 0
              ? `user-${filteredUsers[activeIndex]?.id}`
              : undefined
          }
        />
      </div>

      {isOpen && filteredUsers.length > 0 && (
        <div
          ref={dropdownRef}
          id="user-mention-list"
          className="absolute z-10 w-full mt-1 bg-[#09090b] text-sm text-neutral-300 border rounded-md shadow-lg max-h-60 overflow-auto"
          role="listbox"
        >
          {filteredUsers.map((user, index) => (
            <div
              key={user.id}
              id={`user-${user.id}`}
              data-index={index}
              className={`px-3 py-2 cursor-pointer ${
                index === activeIndex ? "bg-black/50" : "hover:bg-[#141416]"
              }`}
              onClick={() => handleSelectUser(user)}
              role="option"
              aria-selected={index === activeIndex}
            >
              <div className="font-medium">@{user.alias}</div>
              {user.name && (
                <div className="text-sm text-gray-500">{user.name}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
