import React, { useState } from "react";
import { Inbox, Trash, RefreshCw } from "lucide-react";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function DataTable({ users, setUsers, columns, onRefresh }) {
  const [removeIndex, setRemoveIndex] = useState(null);
  const [refreshingIndex, setRefreshingIndex] = useState(null);

  const handleRemoveConfirm = () => {
    if (removeIndex != null && typeof setUsers === "function") {
      setUsers((prev) =>
        prev.filter((_, userIndex) => userIndex !== removeIndex)
      );
      setRemoveIndex(null);
    }
  };

  const handleRemove = (index) => {
    setRemoveIndex(index);
  };

  const handleRefresh = async (index) => {
    if (typeof onRefresh === "function") {
      setRefreshingIndex(index);
      try {
        await onRefresh(index);
      } catch (error) {
        console.error("Error in onRefresh:", error);
      } finally {
        setRefreshingIndex(null);
      }
    } else {
      console.error("onRefresh is not a function");
    }
  };

  const ths = (
    <TableRow>
      {columns.map((col) => (
        <TableHead key={col.key}>{col.name}</TableHead>
      ))}
      <TableHead>Action</TableHead>
    </TableRow>
  );

  const rows = users.map((user, index) => (
    <TableRow key={index}>
      {columns.map((col) => {
        const colKey = col.key;
        const cellContent =
          colKey === "id" ? user?.data?.name : user?.data?.[colKey];
        return (
          <TableCell key={col.key}>
            {refreshingIndex === index && colKey !== "id" ? (
              <span>⏳</span>
            ) : colKey === "id" ? (
              user?.data?.name
            ) : user?.data?.[colKey + "Url"] ? (
              <a
                href={user.data[colKey + "Url"]}
                target="_blank"
                rel="noopener noreferrer"
              >
                {user.data[colKey] || 0}
              </a>
            ) : typeof cellContent === "number" ? (
              cellContent
            ) : (
              cellContent || ""
            )}
          </TableCell>
        );
      })}
      <TableCell>
        <Button variant="secondary" onClick={() => handleRefresh(index)}>
          <RefreshCw size="1.1rem" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="ml-1"
              onClick={() => handleRemove(index)}
            >
              <Trash size={32} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this row? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setRemoveIndex(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 text-white"
                onClick={handleRemoveConfirm}
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  ));

  return (
    <div className="relative">
      <Table className={"border rounded-md text-xl shadow-md"}>
        <TableHeader>{ths}</TableHeader>
        <TableBody>
          {rows.length > 0 ? (
            rows
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="text-center">
                <div className="flex flex-col items-center">
                  <Inbox size={50} />
                  <p className="text-sm text-muted-foreground">No Data</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
