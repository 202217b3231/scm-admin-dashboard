import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "../datatable/App.js";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { Notifications } from "@mantine/notifications";
import { createTheme, MantineProvider } from "@mantine/core";
const theme = createTheme({
  white: "#F0F5F9",
  black: "#222831",
});
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantineProvider defaultColorScheme="light" theme={theme}>
      <Notifications />
      <App />
    </MantineProvider>
  </StrictMode>
);
