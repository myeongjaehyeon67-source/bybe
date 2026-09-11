"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, LogOut } from "lucide-react";
import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [{ href: "/dashboard", label: "Dashboard", icon: LayoutGrid }];

export function Sidebar({ userEmail }: { userEmail: string | null }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r bg-muted/20 p-4 md:flex">
      <span className="px-2 text-sm font-semibold tracking-tight">
        Project OS
      </span>
      <nav className="mt-6 flex flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                active
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      {userEmail && (
        <div className="mt-auto flex flex-col gap-2 border-t pt-3">
          <span className="truncate px-2 text-xs text-muted-foreground">
            {userEmail}
          </span>
          <form action={signOut}>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2"
            >
              <LogOut className="size-4" />
              Log out
            </Button>
          </form>
        </div>
      )}
    </aside>
  );
}
