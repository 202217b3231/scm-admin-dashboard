import React from "react";
import snowIcon from "./assets/snow.png";
import { useDisclosure } from "@mantine/hooks";
import {
  Group,
  ActionIcon,
  useMantineColorScheme,
  Space,
  Modal,
  Text,
  Paper,
  useMantineTheme,
} from "@mantine/core";
import {
  TbMaximize,
  TbInfoCircle,
  TbSettings,
  TbSun,
  TbMoon,
} from "react-icons/tb";
import classes from "./main.module.css";
import cx from "clsx";

export default function Navbar({ openSetting }) {
  const [opened, { open, close }] = useDisclosure(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const openOptionsPage = () => {
    try {
      if (chrome && chrome.runtime && chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        window.open(chrome.runtime.getURL("index.html"));
      }
    } catch (error) {}
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="About Me">
        <Text>
          Himanshu <br />
          202217b3231
        </Text>
      </Modal>
      <Paper
        p="sm"
        className={cx(
          classes.navbar,
          colorScheme === "dark" ? classes.navbarLight : classes.navbarDark
        )}
      >
        <Group justify="space-between" align="center">
          <img
            src={snowIcon}
            alt="Snow Icon"
            style={{
              width: "35px",
            }}
          />
          <h1> Service Now Dashboard</h1>
          <Space w="md" />
          <Group>
            <div className={classes.icon}>
              <div className={classes.iconTop}>
                <ActionIcon
                  color="white"
                  title="About Me"
                  variant="subtle"
                  size={35}
                  onClick={open}
                >
                  <TbInfoCircle size={35} />
                </ActionIcon>
              </div>
            </div>
            <div className={classes.icon}>
              <div className={classes.iconTop}>
                <ActionIcon
                  color="white"
                  title="Settings"
                  variant="subtle"
                  size={35}
                  onClick={openSetting}
                >
                  <TbSettings size={35} />
                </ActionIcon>
              </div>
            </div>
            {colorScheme === "dark" ? (
              <div className={classes.icon}>
                <div className={classes.iconTop}>
                  <ActionIcon
                    color="white"
                    variant="subtle"
                    title="Light Mode"
                    className={classes.light}
                    size={35}
                    onClick={toggleColorScheme}
                  >
                    <TbMoon size={35} />
                  </ActionIcon>
                </div>
              </div>
            ) : (
              <div className={classes.icon}>
                <div className={classes.iconTop}>
                  <ActionIcon
                    color="white"
                    variant="subtle"
                    title="Dark Mode"
                    className={classes.dark}
                    size={35}
                    onClick={toggleColorScheme}
                  >
                    <TbSun size={35} />
                  </ActionIcon>
                </div>
              </div>
            )}

            <div className={classes.icon}>
              <div className={classes.iconTop}>
                <ActionIcon
                  title="Full Screen"
                  variant="subtle"
                  color="white"
                  size={35}
                  onClick={openOptionsPage}
                >
                  <TbMaximize size={35} />
                </ActionIcon>
              </div>
            </div>
          </Group>
        </Group>
      </Paper>
    </>
  );
}
