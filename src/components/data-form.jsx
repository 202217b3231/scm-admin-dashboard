import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Copy, Trash, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import Settings from "./data-settings";

export default function DataForm({
  users,
  addUser,
  dates,
  setDates,
  copyData,
  setUsers,
  columns,
  setColumns,
  defaultColumns,
}) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    console.log("Dates updated:", dates);
    console.log("Users updated:", users);
  }, [dates, users]);

  const handleAddUser = (e) => {
    e.preventDefault();
    const userInput = e.target.elements.userInput.value.trim();
    if (userInput) {
      const newUser = {
        id: Date.now(),
        data: { name: userInput },
      };
      addUser(newUser);
      e.target.reset();
      toast.success("User Added", {
        description: `User "${userInput}" has been added.`,
      });
    } else {
      toast.warning("Input Required", {
        description: "Please enter a user name.",
      });
    }
  };

  const clearData = () => {
    setUsers([]);

    localStorage.removeItem("users");

    toast.error("Data Cleared", {
      description: "All user data has been cleared.",
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 rounded-md shadow-sm">
      <form onSubmit={handleAddUser} className="flex gap-2 items-center">
        <Input
          name="userInput"
          placeholder="Enter User Name"
          className="w-auto flex-grow sm:flex-grow-0 sm:w-48"
        />
        <Button type="submit" variant="default">
          Add User
        </Button>
      </form>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full sm:w-[300px] justify-start text-left font-normal",
              !dates?.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dates?.from ? (
              dates.to ? (
                <>
                  {format(dates.from, "LLL dd, y")} -{" "}
                  {format(dates.to, "LLL dd, y")}
                </>
              ) : (
                format(dates.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-white border shadow-lg rounded-md"
          align="start"
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dates?.from || new Date()}
            selected={dates}
            onSelect={setDates}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      <Button
        variant="outline"
        size="icon"
        onClick={() => copyData()}
        title="Copy Data"
      >
        <Copy className="h-4 w-4" />
      </Button>
      <Button
        variant="destructive"
        onClick={clearData}
        title="Clear All User Data"
        className="flex items-center gap-1"
      >
        <Trash className="h-4 w-4" />
        Clear Data
      </Button>
      <Button
        variant="secondary"
        onClick={() => setSettingsOpen(true)}
        title="Edit Columns"
        className="flex items-center gap-1"
      >
        <Edit className="h-4 w-4" />
        Edit Columns
      </Button>
      <Settings
        opened={settingsOpen}
        close={() => setSettingsOpen(false)}
        columns={columns}
        setColumns={setColumns}
        defaultColumns={defaultColumns}
      />
    </div>
  );
}
