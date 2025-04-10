import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateRandomAlias = (): string => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let alias = "";
  for (let i = 0; i < 10; i++) {
    alias += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return alias;
};
