"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Fragment } from "react";

export function AppBreadcrumb() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);

  const buildHref = (index: number) => {
    if (index === 0) return "/mail/inbox";
    return "/" + segments.slice(0, index + 1).join("/");
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const name = decodeURIComponent(segment).replace(/-/g, " ");
          const label = name.charAt(0).toUpperCase() + name.slice(1);

          return (
            <Fragment key={index}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={buildHref(index)}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
