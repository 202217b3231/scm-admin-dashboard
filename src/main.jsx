import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import NotFoundPage from "./pages/NotFound";
import Login from "@/pages/Login";
import App from "./App";
import "./index.css";
import DataTablePage from "./pages/DataTable";
import TaskPage from "./pages/TaskPage";
import ScriptPage from "./pages/ScriptPage";
import SettingsPage from "./pages/SettingsPage";
import MainLayout from "./Layout";
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <App />,
        errorElement: <NotFoundPage />,
      },
      {
        path: "/data-table",
        element: <DataTablePage />,
        errorElement: <NotFoundPage />,
      },
      {
        path: "/login",
        element: <Login />,
        errorElement: <NotFoundPage />,
      },
      {
        path: "/task",
        element: <TaskPage />,
        errorElement: <NotFoundPage />,
      },
      {
        path: "/scripts",
        element: <ScriptPage />,
        errorElement: <NotFoundPage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
        errorElement: <NotFoundPage />,
      },
    ],
  },
  {
    path: "/*",
    element: <NotFoundPage />,
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
