import React, { useEffect } from "react";
import {
  TextInput,
  Group,
  Button,
  Modal,
  Text,
  Paper,
  useMantineColorScheme,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { MdOutlineContentCopy, MdAdd } from "react-icons/md";
import { AiOutlineClear } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import classes from "./main.module.css";
import cx from "clsx";

export default function Form({
  userForm,
  setForm,
  onAddUser,
  copyData,
  setUsers,
  users,
}) {
  const form = useForm({
    initialValues: {
      id: "",
      dates: [userForm.startDate, userForm.endDate],
    },
  });
  const { colorScheme } = useMantineColorScheme();
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    form.setFieldValue("dates", [userForm.startDate, userForm.endDate]);
  }, [userForm]);

  const handleDateChange = (dates) => {
    if (dates) {
      setForm({
        ...userForm,
        startDate: dates[0],
        endDate: dates[1],
      });
    }
  };

  const handleSubmit = (values) => {
    if (values.id) {
      const isDuplicate = users.some((user) => user.id === values.id);
      if (isDuplicate) {
        alert("User with this ID already exists!");
        return;
      }
      const newUser = {
        id: values.id,
        startDate: form.values.dates[0],
        endDate: form.values.dates[1],
      };
      onAddUser(newUser);
      form.reset();
    }
  };

  const clearData = () => {
    open();
  };

  const handleClearDataConfirm = () => {
    setUsers([]);
    close();
  };

  return (
    <>
      <Modal opened={opened} onClose={close} withCloseButton={false}>
        <Text size="lg">Are you sure you want to clear All data?</Text>
        <Group mt="lg" justify="flex-end">
          <Button className={classes.button} color="gray" onClick={close}>
            Cancel
          </Button>
          <Button
            className={classes.button}
            onClick={handleClearDataConfirm}
            color="red"
          >
            Confirm
          </Button>
        </Group>
      </Modal>
      <Paper
        p="lg"
        className={cx(
          classes.form,
          colorScheme === "dark" ? classes.paperDark : classes.paperLight
        )}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Group justify="space-around">
            <Group>
              <TextInput
                radius={10}
                bd={5}
                leftSection={<FaUser />}
                classNames={{
                  input: cx(
                    classes.input,
                    colorScheme === "dark"
                      ? classes.inputDark
                      : classes.inputLight
                  ),
                }}
                size="md"
                placeholder="User Id"
                {...form.getInputProps("id")}
                withAsterisk
                error={form.errors.id}
              />
              <DatePickerInput
                miw={310}
                radius={10}
                classNames={{
                  input: cx(
                    classes.input,
                    colorScheme === "dark"
                      ? classes.inputDark
                      : classes.inputLight
                  ),
                }}
                size="md"
                type="range"
                placeholder="Start Date - End Date"
                {...form.getInputProps("dates")}
                onChange={handleDateChange}
                withAsterisk
                error={form.errors.dates}
              />
            </Group>
            <Group>
              <Button
                radius={10}
                className={classes.button}
                leftSection={<MdAdd />}
                variant="gradient"
                gradient={{ from: "grape", to: "violet", deg: 15 }}
                size="md"
                type="submit"
              >
                Add
              </Button>
              <Button
                radius={10}
                className={classes.button}
                size="md"
                leftSection={<AiOutlineClear />}
                variant="gradient"
                gradient={{ from: "red", to: "pink", deg: 15 }}
                onClick={clearData}
              >
                Clear
              </Button>
              <Button
                radius={10}
                className={classes.button}
                size="md"
                variant="gradient"
                leftSection={<MdOutlineContentCopy />}
                gradient={{ from: "violet", to: "cyan", deg: 15 }}
                onClick={copyData}
              >
                Copy
              </Button>
            </Group>
          </Group>
        </form>
      </Paper>
    </>
  );
}
