import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Trash } from "lucide-react";
import { useState, useEffect } from "react";

export default function Settings({
  opened,
  close,
  columns,
  setColumns,
  defaultColumns,
}) {
  const [editedColumns, setEditedColumns] = useState(columns);

  useEffect(() => {
    setEditedColumns(columns);
  }, [columns]);

  const addColumn = () => {
    const newColumn = {
      name: "",
      tableName: "",
      key: editedColumns.length,
    };
    setEditedColumns((prev) => [...prev, newColumn]);
  };

  const resetColumns = () => {
    localStorage.removeItem("columns");
    setEditedColumns(defaultColumns);
    setColumns(defaultColumns);
  };

  const handleColumnChange = (key, field, value) => {
    const newEditedColumns = editedColumns.map((col) => {
      if (col.key === key) {
        return { ...col, [field]: value };
      }
      return col;
    });
    setEditedColumns(newEditedColumns);
    setColumns(newEditedColumns);
  };

  const removeColumn = (key) => {
    const newEditedColumns = editedColumns.filter((col) => col.key !== key);
    setEditedColumns(newEditedColumns);
    setColumns(newEditedColumns);
  };

  return (
    <Dialog open={opened} onOpenChange={close}>
      <DialogContent className="min-w-[60vw] min-h-[90vh] bg-white">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-auto">
          <Table className="w-full border border-gray-300 rounded-md">
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="px-4 py-2 text-left font-semibold text-gray-700">
                  Column Name
                </TableHead>
                <TableHead className="px-4 py-2 text-left font-semibold text-gray-700">
                  Table Name
                </TableHead>
                <TableHead className="px-4 py-2 text-left font-semibold text-gray-700">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {editedColumns.map((col) => (
                <TableRow
                  key={col.key}
                  className="hover:bg-gray-50 border-b border-gray-200"
                >
                  <TableCell className="px-4 py-2">
                    <Input
                      value={col.name}
                      onChange={(e) =>
                        handleColumnChange(col.key, "name", e.target.value)
                      }
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <Input
                      value={col.tableName}
                      onChange={(e) =>
                        handleColumnChange(col.key, "tableName", e.target.value)
                      }
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeColumn(col.key)}
                      className="flex items-center justify-center"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <DialogFooter className="mt-4 flex justify-end space-x-2">
          <Button variant="secondary" onClick={addColumn}>
            Add Column
          </Button>
          <Button variant="secondary" onClick={resetColumns}>
            Reset
          </Button>
          <Button variant="destructive" onClick={close}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
