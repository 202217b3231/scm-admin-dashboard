import React, { useState } from "react";
import {
  Table,
  Text,
  Group,
  Center,
  Loader,
  ActionIcon,
  Modal,
  Button,
} from "@mantine/core";
import { FiInbox } from "react-icons/fi";
import { TbRefresh, TbTrash } from "react-icons/tb";
import { useDisclosure } from "@mantine/hooks";
import classes from "./main.module.css";

export default function DataTable({
  users,
  setUsers,
  columns,
  loading,
  fetchRowData,
  setFetchError,
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const [removeIndex, setRemoveIndex] = useState(null);

  const handleRemoveConfirm = () => {
    if (removeIndex != null) {
      setUsers((prev) =>
        prev.filter((_, userIndex) => userIndex !== removeIndex)
      );
      close();
      setRemoveIndex(null);
    }
  };

  const handleRemove = (index) => {
    setRemoveIndex(index);
    open();
  };

  const ths = (
    <Table.Tr>
      {columns.map((col) => (
        <Table.Th className={classes.tableHeader} size="lg" key={col.key}>
          {col.name}
        </Table.Th>
      ))}
      <Table.Th className={classes.tableHeader} size="lg">
        Action
      </Table.Th>
    </Table.Tr>
  );

  const rows = users.map((user, index) => (
    <Table.Tr key={index}>
      {columns.map((col) => {
        const colName = col.name.toLowerCase().replace(" ", "");
        const cellContent = user.data[colName];
        return (
          <Table.Td className={classes.tableCell} key={col.key}>
            {colName === "id" ? (
              user.id
            ) : loading && cellContent === "loading" ? (
              <Center>
                <Loader size="sm" />
              </Center>
            ) : user.data[colName + "Url"] ? (
              <a
                href={user.data[colName + "Url"]}
                target="_blank"
                rel="noopener noreferrer"
                className={classes.link}
              >
                {user.data[colName] || 0}
              </a>
            ) : typeof cellContent === "number" ? (
              cellContent
            ) : (
              cellContent || ""
            )}
          </Table.Td>
        );
      })}
      <Table.Td>
        <Group>
          <ActionIcon
            size="lg"
            className={classes.button}
            variant="gradient"
            gradient={{ from: "violet", to: "teal", deg: 225 }}
            onClick={() => {
              setFetchError(null);
              fetchRowData(index);
            }}
          >
            <TbRefresh size="1.1rem" />
          </ActionIcon>
          <ActionIcon
            size="lg"
            className={classes.button}
            variant="gradient"
            gradient={{ from: "red", to: "pink", deg: 225 }}
            onClick={() => handleRemove(index)}
          >
            <TbTrash size="1.1rem" />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Modal opened={opened} onClose={close} withCloseButton={false}>
        <Text size="lg">Are you sure you want to remove this user?</Text>
        <Group mt="lg" justify="flex-end">
          <Button className={classes.button} color="gray" onClick={close}>
            Cancel
          </Button>
          <Button
            className={classes.button}
            onClick={handleRemoveConfirm}
            color="red"
          >
            Confirm
          </Button>
        </Group>
      </Modal>
      <Table
        className={classes.table}
        striped
        withTableBorder
        withColumnBorders
      >
        <Table.Thead>{ths}</Table.Thead>
        <Table.Tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Td colSpan={columns.length + 1}>
                <Center>
                  <Group direction="column" align="center" spacing="sm">
                    <FiInbox size={50} />
                    <Text size="sm" color="dimmed">
                      No Data
                    </Text>
                  </Group>
                </Center>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </>
  );
}
