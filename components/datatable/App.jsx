import DataTable from "./DataTable";
import Navbar from "./Navbar";
import Form from "./Form";
import Settings from "./Settings";
import React, { useState, useCallback, useEffect } from "react";
import { Stack, Loader, Alert, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { FaCheck } from "react-icons/fa";
import { useDisclosure } from "@mantine/hooks";
import moment from "moment";

function useUsersData() {
  const [users, setUsers] = useState(() => {
    const storedUsers = localStorage.getItem("users");
    return storedUsers ? JSON.parse(storedUsers) : [];
  });

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  return { users, setUsers };
}

function useUrl() {
  const [jiraUrl, setJiraUrl] = useState(() => {
    const storedUrl = localStorage.getItem("jiraUrl");
    return storedUrl ? storedUrl : "https://jira.jnj.com";
  });
  const [snowUrl, setSnowUrl] = useState(() => {
    const storedUrl = localStorage.getItem("snowUrl");
    return storedUrl ? storedUrl : "https://jnjprod.service-now.com";
  });
  useEffect(() => {
    localStorage.setItem("jiraUrl", jiraUrl);
  }, [jiraUrl]);
  useEffect(() => {
    localStorage.setItem("snowUrl", snowUrl);
  }, [snowUrl]);

  return { jiraUrl, setJiraUrl, snowUrl, setSnowUrl };
}

function useUserForm() {
  const [userForm, setForm] = useState(() => {
    const storedStartDate = localStorage.getItem("startDate");
    const storedEndDate = localStorage.getItem("endDate");
    const startDate = storedStartDate
      ? new Date(storedStartDate)
      : new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
    const endDate = storedEndDate
      ? new Date(storedEndDate)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 0);

    return {
      id: "",
      startDate: startDate,
      endDate: endDate,
    };
  });

  useEffect(() => {
    localStorage.setItem("startDate", userForm.startDate.toISOString());
    localStorage.setItem("endDate", userForm.endDate?.toISOString());
  }, [userForm.startDate, userForm.endDate]);

  return { userForm, setForm };
}

function useColumnsData() {
  const initialColumns = [
    { name: "ID", tableName: "sys_user", key: 0 },
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

  return { defaultColumns, columns, setColumns };
}

function useModalState() {
  const [settingOpened, { open: openSetting, close: closeSetting }] =
    useDisclosure(false);
  return { settingOpened, openSetting, closeSetting };
}

function useTableDataFormatter(columns, users) {
  const formatTableData = useCallback(() => {
    return (
      columns.map((col) => col.name).join("\t") +
      "\n" +
      users
        .map((user) =>
          columns
            .map((col) => {
              const colName = col.name.toLowerCase().replace(" ", "");
              return colName === "id"
                ? user.id
                : user.data[colName] !== "loading"
                ? user.data[colName]
                : "0";
            })
            .join("\t")
        )
        .join("\n")
    );
  }, [columns, users]);

  return { formatTableData };
}

function useClipboard(formatTableData) {
  const copyData = useCallback(() => {
    const tableData = formatTableData();
    navigator.clipboard.writeText(tableData).then(() => {
      notifications.show({
        title: "Data copied",
        message: "Data copied to clipboard",
        icon: <FaCheck />,
        color: "green",
        autoClose: 1000,
      });
    });
  }, [formatTableData]);

  return { copyData };
}

function App() {
  const { users, setUsers } = useUsersData();
  const { userForm, setForm } = useUserForm();
  const { columns, defaultColumns, setColumns } = useColumnsData();
  const { settingOpened, openSetting, closeSetting } = useModalState();
  const { formatTableData } = useTableDataFormatter(columns, users);
  const { copyData } = useClipboard(formatTableData);
  const { jiraUrl, setJiraUrl, snowUrl, setSnowUrl } = useUrl();
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const fetchTableData = useCallback(
    async (url, tableName) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, "text/html");
        const element = doc.querySelector(`#${tableName} tbody`);
        return element ? element.rows.length : 0;
      } catch (error) {
        console.error(`Error fetching data for ${tableName}:`, error);
        if (error.message === "Failed to fetch") {
          setFetchError(
            <>
              Please login to{" "}
              <a href={snowUrl} target="_blank" rel="noopener noreferrer">
                Servicenow
              </a>
            </>
          );
        } else {
          setFetchError(error.message);
        }
        return "error";
      }
    },
    [snowUrl]
  );

  const generateTemplateUrls = useCallback(
    (userId, startDate, endDate) => {
      const startDateFormatted = startDate
        ? `javascript:gs.dateGenerate('${startDate}', '00:00:00')`
        : "javascript:gs.beginningOfLastMonth()";
      const endDateFormatted = endDate
        ? `javascript:gs.dateGenerate('${endDate}', '23:59:59')`
        : "javascript:gs.endOfLastMonth()";

      return columns.map((col) => {
        let urlTemplate = "";
        if (col.tableName === "issuetable") {
          urlTemplate = `${jiraUrl}/issues/?filter=-1&jql=created >= ${startDate} AND created <= ${endDate} AND assignee in (${userId}) order by updated DESC`;
        } else {
          urlTemplate = `${snowUrl}/${col.tableName}_list.do?sysparm_query=assigned_to.user_name=${userId}^sys_created_onBETWEEN${startDateFormatted}@${endDateFormatted}`;
        }
        return urlTemplate;
      });
    },
    [columns, jiraUrl, snowUrl]
  );

  const fetchRowData = useCallback(
    async (index) => {
      if (!users[index] || !users[index].id) return;
      setLoading(true);
      setFetchError(null);

      const user = users[index].id;
      const startDate = moment(userForm.startDate).format("YYYY-MM-DD");
      const endDate = moment(userForm.endDate).format("YYYY-MM-DD");
      const templateUrls = generateTemplateUrls(user, startDate, endDate);

      const newData = { ...users[index].data };
      columns.forEach((col) => {
        const colName = col.name.toLowerCase().replace(" ", "");
        if (colName !== "id") {
          newData[colName] = <Loader size="xs" />;
        }
      });
      setUsers((prevUsers) => {
        const newUsers = [...prevUsers];
        newUsers[index] = { ...newUsers[index], data: newData };
        return newUsers;
      });

      const fetchPromises = columns.map(async (col, idx) => {
        const colName = col.name.toLowerCase().replace(" ", "");
        if (colName === "id") return Promise.resolve();
        newData[colName] = "loading";
        newData[colName + "Url"] = null;
        try {
          const count = await fetchTableData(templateUrls[idx], col.tableName);
          newData[colName] = count;
          newData[colName + "Url"] = templateUrls[idx];
          if (count === "error") {
            throw new Error(
              `fetchTableData returned an error for column ${colName}.`
            );
          }
        } catch (error) {
          newData[colName] = "error";
          newData[colName + "Url"] = null;
        }
      });

      try {
        await Promise.all(fetchPromises);
      } catch (error) {
      } finally {
        setLoading(false);
      }

      setUsers((prevUsers) => {
        const newUsers = [...prevUsers];
        if (newUsers[index]) {
          newUsers[index] = { ...newUsers[index], data: newData };
        }
        return newUsers;
      });
    },
    [columns, generateTemplateUrls, fetchTableData, setUsers, users, userForm]
  );

  const handleAddUser = async (newUser) => {
    setUsers((prev) => [...prev, { ...newUser, data: {} }]);
    await fetchRowData(users.length);
  };

  const handleCloseError = () => {
    setFetchError(null);
  };

  return (
    <>
      <Stack align="center" justify="center">
        <Navbar openSetting={openSetting} />
        <Form
          userForm={userForm}
          setForm={setForm}
          onAddUser={handleAddUser}
          setUsers={setUsers}
          copyData={copyData}
          columns={columns}
          users={users}
        />
        {fetchError && (
          <Alert
            title="Error"
            color="red"
            withCloseButton
            onClose={handleCloseError}
          >
            <Text>{fetchError}</Text>
          </Alert>
        )}
        <DataTable
          users={users}
          jiraUrl={jiraUrl}
          snowUrl={snowUrl}
          setUsers={setUsers}
          columns={columns}
          userForm={userForm}
          loading={loading}
          setFetchError={setFetchError}
          fetchRowData={fetchRowData}
        />
        <Settings
          opened={settingOpened}
          close={closeSetting}
          columns={columns}
          jiraUrl={jiraUrl}
          setJiraUrl={setJiraUrl}
          snowUrl={snowUrl}
          setSnowUrl={setSnowUrl}
          defaultColumns={defaultColumns}
          setColumns={setColumns}
        />
      </Stack>
    </>
  );
}

export default App;
