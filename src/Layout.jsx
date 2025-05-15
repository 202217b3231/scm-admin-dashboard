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
import { useNavigate, Outlet } from "react-router-dom";
import { useState } from "react";

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
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <SidebarProvider defaultOpen={isSidebarOpen}>
      <div className="main-layout flex h-full w-full p-0 m-0">
        <Sidebar collapsible="icon" open={isSidebarOpen}>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Application</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={() => {
                          navigate(item.url);
                          setIsSidebarOpen(false);
                        }}
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
          <SidebarGroup>
            <SidebarGroupLabel>Ctrl+B to hide/show</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarTrigger className="ml-1 text-blue-400" />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </Sidebar>
        <div className="content flex-1 p-0 m-0 overflow-auto">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
