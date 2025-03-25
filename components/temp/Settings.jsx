import {
  Group,
  Modal,
  Button,
  Input,
  Table,
  TextInput,
  ActionIcon,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { TbTrash } from "react-icons/tb";
import classes from "./main.module.css";

export default function Settings({
  opened,
  close,
  columns,
  setColumns,
  defaultColumns,
  setSnowUrl,
  setJiraUrl,
  jiraUrl,
  snowUrl,
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
    <Modal opened={opened} onClose={close} title="Settings" size={750}>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Column Name</Table.Th>
            <Table.Th>Table Name</Table.Th>
            <Table.Th>Action</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {editedColumns.map((col) => (
            <Table.Tr key={col.key}>
              <Table.Td>
                <TextInput
                  value={col.name}
                  onChange={(e) =>
                    handleColumnChange(col.key, "name", e.target.value)
                  }
                />
              </Table.Td>
              <Table.Td>
                <TextInput
                  value={col.tableName}
                  onChange={(e) =>
                    handleColumnChange(col.key, "tableName", e.target.value)
                  }
                />
              </Table.Td>
              <Table.Td>
                <Group>
                  <ActionIcon
                    className={classes.button}
                    variant="gradient"
                    gradient={{ from: "red", to: "pink", deg: 225 }}
                    onClick={() => removeColumn(col.key)}
                  >
                    <TbTrash />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
        <Table.Caption>
          <Group>
            <Input
              value={snowUrl}
              onChange={(e) => setSnowUrl(e.target.value)}
              placeholder="Service Now Url"
            />
            <Input
              value={jiraUrl}
              onChange={(e) => setJiraUrl(e.target.value)}
              placeholder="Jira Url"
            />
            <Button
              className={classes.button}
              variant="gradient"
              gradient={{ from: "#38a3a5", to: "#22577a", deg: 15 }}
              onClick={addColumn}
            >
              Add Column
            </Button>
            <Button
              className={classes.button}
              variant="gradient"
              gradient={{ from: "#ee4266", to: "#540d6e", deg: 15 }}
              onClick={resetColumns}
            >
              Reset
            </Button>
            <Button
              className={classes.button}
              variant="gradient"
              gradient={{ from: "#ef233c", to: "#d90429", deg: 15 }}
              onClick={close}
            >
              Close
            </Button>
          </Group>
        </Table.Caption>
      </Table>
    </Modal>
  );
}
