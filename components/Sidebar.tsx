import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import Link from "next/link";
import {
  LayoutDashboard,
  FileJson,
  LayoutList,
  UserRoundPen,
  Settings,
  Table2,
  Workflow,
  Sheet,
} from "lucide-react";

const Sidebar = () => {
  return (
    <Command className="bg-secondary rounded-none ">
      <CommandInput placeholder="Search..." />
      <CommandList className="max-h-[400px]">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="ServiceNow">
          <CommandItem>
            <LayoutDashboard />
            <Link href="/">Dashboard</Link>
          </CommandItem>
          <CommandItem>
            <Workflow />
            <Link href="/workflow">Workflow</Link>
          </CommandItem>
          <CommandItem>
            <Table2 />
            <Link href="/datatable">DataTable</Link>
          </CommandItem>
          <CommandItem>
            <FileJson />
            <Link href="/userscript">Userscripts</Link>
          </CommandItem>
          <CommandItem>
            <LayoutList />
            <Link href="/tasks">Tasks</Link>
          </CommandItem>
          <CommandItem>
            <Sheet />
            <Link href="/reports">Reports</Link>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <UserRoundPen />
            <Link href="/profile">Profile</Link>
          </CommandItem>
          <CommandItem>
            <Settings />
            <Link href="/settings">Settings</Link>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default Sidebar;
