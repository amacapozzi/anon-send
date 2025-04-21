import { formattingActions } from "@/utils/format";
import { Bold, Italic, Underline, List } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface FormatAction {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}

export const formatActions: Record<string, FormatAction> = {
  bold: {
    icon: Bold,
    label: "Bold",
    onClick: formattingActions.bold,
  },
  italic: {
    icon: Italic,
    label: "Italic",
    onClick: formattingActions.italic,
  },
  underline: {
    icon: Underline,
    label: "Underline",
    onClick: formattingActions.underline,
  },
  list: {
    icon: List,
    label: "List",
    onClick: () => console.log("List clicked"),
  },
};
