"use client";

import * as React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  ListChecks,
  UserPlus,
  UsersRound,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { Role } from "@/types/api";
import { useAuth } from "@/components/providers/auth-provider";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
}

const NAV_ITEMS: NavItem[] = [
  {
    title: "Mi historial",
    url: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "guard", "student", "professor", "visitor"],
  },
  {
    title: "Eventos de acceso",
    url: "/dashboard/events",
    icon: ListChecks,
    roles: ["admin", "guard"],
  },
  {
    title: "Visitantes",
    url: "/visitors",
    icon: UsersRound,
    roles: ["admin", "guard"],
  },
  {
    title: "Usuarios",
    url: "/users",
    icon: UserPlus,
    roles: ["admin"],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  const items = NAV_ITEMS.filter(
    (item) => !user || item.roles.includes(user.role),
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/dashboard" />}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <LayoutDashboard className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Reception</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Control de acceso
                  </span>
                </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
