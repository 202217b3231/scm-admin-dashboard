import DataTable from "../components/data-table";
import DataForm from "../components/data-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import useFetchTableData from "../hooks/useFetchTableData";

function useUsers() {
  const [users, setUsers] = useState(() => {
    const storedUsers = localStorage.getItem("users");
    return storedUsers ? JSON.parse(storedUsers) : [];
  });

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  return { users, setUsers };
}

function useDates() {
  const [dates, setDates] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    to: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
  });

  return { dates, setDates };
}

function useColumnsData() {
  const initialColumns = [
    { name: "ID", tableName: "sys_user", key: "id", immutable: true },
    { name: "Incident", tableName: "incident", key: 1 },
    { name: "Changes", tableName: "change_request", key: 2 },
    { name: "Change Task", tableName: "change_task", key: 3 },
    { name: "Task", tableName: "sc_task", key: 4 },
    { name: "Personal Task", tableName: "personal_task", key: 5 },
    { name: "Jira", tableName: "issuetable", key: 6 },
  ];
  const [columns, setColumns] = useState(() => {
    const storedColumns = localStorage.getItem("columns");
    return storedColumns ? JSON.parse(storedColumns) : initialColumns;
  });
  const defaultColumns = JSON.parse(JSON.stringify(initialColumns));

  useEffect(() => {
    localStorage.setItem("columns", JSON.stringify(columns));
  }, [columns]);

  const updateColumns = (newColumns) => {
    const filteredColumns = newColumns.map((col) => {
      if (col.immutable) {
        return (
          columns.find((existingCol) => existingCol.key === col.key) || col
        );
      }
      return col;
    });
    setColumns(filteredColumns);
  };

  return { defaultColumns, columns, setColumns: updateColumns };
}

function useTableClipboard(columns, users) {
  const formatTableData = useCallback(() => {
    const header = columns.map((col) => col.name).join("\t");
    const rows = users
      .map((user) =>
        columns
          .map((col) => {
            const colKey = col.key;
            if (colKey === "id") {
              return user.data.name ?? "";
            }
            const cellValue = user.data?.[colKey];
            if (cellValue === "loading") return "0";
            return cellValue ?? "";
          })
          .join("\t")
      )
      .join("\n");

    return `${header}\n${rows}`;
  }, [columns, users]);

  const copyData = useCallback(() => {
    const tableData = formatTableData();
    navigator.clipboard
      .writeText(tableData)
      .then(() => {
        toast.success("Data copied", {
          description: "Table data copied to clipboard",
          duration: 1500,
        });
      })
      .catch((err) => {
        console.error("Failed to copy data to clipboard:", err);
        toast.error("Copy Failed", {
          description: "Could not copy data to clipboard.",
          duration: 2000,
        });
      });
  }, [formatTableData]);

  return { copyData };
}

const DataTablePage = () => {
  const { dates, setDates } = useDates();
  const { users, setUsers } = useUsers();
  const { columns, defaultColumns, setColumns } = useColumnsData();
  const { copyData } = useTableClipboard(columns, users);
  const { fetchTableData, loading, setLoading } = useFetchTableData(columns);

  const handleRefresh = async (index) => {
    const user = users[index];
    if (!user || !user.id) return;

    const startDate = format(dates.from, "yyyy-MM-dd");
    const endDate = format(dates.to, "yyyy-MM-dd");

    setLoading(true);
    try {
      await fetchTableData(user.data.name, startDate, endDate, setUsers, index);
    } catch (error) {
      console.error("Failed to refresh data:", error);
      toast.error("Failed to refresh data");
    } finally {
      setLoading(false);
    }
  };

  const addUser = (newUser) => {
    setUsers((currentUsers) => [...currentUsers, newUser]);
  };

  return (
    <div className="p-4 w-[90vw]">
      <Breadcrumb className="mt-1 mb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/">Home</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>DataTable</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <DataForm
        dates={dates}
        setDates={setDates}
        columns={columns}
        setColumns={setColumns}
        defaultColumns={defaultColumns}
        addUser={addUser}
        setUsers={setUsers}
        users={users}
        setLoading={setLoading}
        copyData={copyData}
      />

      <div className="mt-4">
        <DataTable
          users={users}
          setUsers={setUsers}
          columns={columns}
          loading={loading}
          dates={dates}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  );
};
export default DataTablePage;
