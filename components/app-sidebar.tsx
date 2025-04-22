"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

import { useCallback } from "react";
import { NavUser } from "@/components/nav-user";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { mailData } from "@/consts/mail";
import { AppSidebarOpenMessage } from "@/components/app-sidebar-open-message";
import type { MailData } from "@/types/mail";
import type { SessionUser } from "@/types/session";
import { formatDateFromNow } from "@/utils/data";
import { StatusBadge } from "@/components/status-badge";
import Link from "next/link";

export function AppSidebar({
  user,
  initialMails,
  ...props
}: {
  initialMails: MailData[];
  user: SessionUser;
} & React.ComponentProps<typeof Sidebar>) {
  const [mailSubject, setMailSubject] = React.useState<string>("");
  const router = useRouter();
  const pathname = usePathname();
  const [mails, setMails] = React.useState<MailData[]>(initialMails);

  const activeItem = React.useMemo(() => {
    return mailData.navMain.find((item) => pathname === item.url);
  }, [pathname]);

  const { setOpen } = useSidebar();

  const handleClick = useCallback(
    (item: { title: string; url: string }) => {
      router.push(item.url);
    },
    [router]
  );

  const filteredItems = () => {
    if (!mailSubject) return mails;
    return mails.filter((mail) => {
      const query = mailSubject.toLowerCase();
      return (
        mail.subject.toLowerCase().includes(query) ||
        mail.body.toLowerCase().includes(query) ||
        mail.sender?.alias?.toLowerCase().includes(query)
      );
    });
  };

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row font-[family-name:var(--font-geist-sans)]"
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <AppSidebarOpenMessage />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {mailData.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        handleClick(item);
                        const mail = mailData.mails.sort(
                          () => Math.random() - 0.5
                        );

                        setOpen(true);
                      }}
                      isActive={activeItem?.title === item.title}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      </Sidebar>

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-base font-medium text-foreground">
              {activeItem?.title}
            </div>
            <Label className="flex items-center gap-2 text-sm">
              <span>Unreads</span>
              <Switch className="shadow-none" />
            </Label>
          </div>
          <SidebarInput
            onChange={(e) => setMailSubject(e.target.value)}
            placeholder="Type to search..."
          />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {filteredItems().map((mail) => (
                <Link
                  href={`/mail/chat/${mail.id}`}
                  key={mail.id}
                  className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <div className="flex w-full items-center gap-2">
                    <span>{mail.sender?.alias}</span>
                    <span className="ml-auto text-xs">
                      {formatDateFromNow(mail.createdAt)}
                    </span>
                  </div>
                  <span className="font-medium">Re: {mail.subject}</span>
                  <div className="flex w-full items-start justify-between gap-2">
                    <span className="line-clamp-2 flex-1 whitespace-break-spaces text-xs">
                      {mail.body}
                    </span>
                    <StatusBadge status={mail.read ? "read" : "unread"} />
                  </div>
                </Link>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
}
