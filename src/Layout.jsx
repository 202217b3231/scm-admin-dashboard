import { Calendar, Home, Inbox, FileCode, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Link, Outlet } from "react-router-dom";

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Data Table",
    url: "/data-table",
    icon: Inbox,
  },
  {
    title: "Task",
    url: "/task",
    icon: Calendar,
  },
  {
    title: "Scripts",
    url: "/scripts",
    icon: FileCode,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export default function MainLayout() {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarTrigger className="ml-2 text-blue-400" />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <Outlet />
    </SidebarProvider>
  );
}
