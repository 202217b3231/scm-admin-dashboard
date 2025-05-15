import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import NotFoundPage from "./pages/NotFound";
import Login from "@/pages/Login";
import DataTablePage from "./pages/DataTable";
import ScriptPage from "./pages/ScriptPage";
import SettingsPage from "./pages/SettingsPage";
import MainLayout from "./Layout";
import Home from "./pages/Homepage";
import TaskPage from "./pages/TaskPage";

const queryClient = new QueryClient();

const App = () => {
  const [isTaskPageIndex, setIsTaskPageIndex] = useState(false);

  useEffect(() => {
    const updateIndexRoute = () => {
      const width = window.innerWidth;
      setIsTaskPageIndex(width > 300 && width < 580);
    };

    updateIndexRoute();
    window.addEventListener("resize", updateIndexRoute);

    return () => {
      window.removeEventListener("resize", updateIndexRoute);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter basename="/">
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {isTaskPageIndex ? (
              <Route index element={<TaskPage />} />
            ) : (
              <Route index element={<Home />} />
            )}
            <Route path="data-table" element={<DataTablePage />} />
            <Route path="login" element={<Login />} />
            <Route path="task" element={<TaskPage />} />
            <Route path="scripts" element={<ScriptPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="/task" element={<TaskPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  );
};

export default App;
