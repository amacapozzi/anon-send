// consts/userMenu.ts
import { logout } from "@/lib/auth";
import { BadgeCheck, Bell, CreditCard, LogOut, Sparkles } from "lucide-react";

export const userMenuItems = [
  {
    group: [
      {
        label: "Upgrade to Pro",
        icon: Sparkles,
        onClick: () => {
          console.log("Upgrade to Pro");
        },
      },
    ],
  },
  {
    group: [
      {
        label: "Account",
        icon: BadgeCheck,
        onClick: () => {
          console.log("Go to Account");
        },
      },
      {
        label: "Billing",
        icon: CreditCard,
        onClick: () => {
          console.log("Go to Billing");
        },
      },
      {
        label: "Notifications",
        icon: Bell,
        onClick: () => {
          console.log("Open Notifications");
        },
      },
    ],
  },
  {
    group: [
      {
        label: "Log out",
        icon: LogOut,
        onClick: logout,
      },
    ],
  },
];
