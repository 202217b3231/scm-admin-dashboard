import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import NotFoundPage from "./pages/NotFound";
import Login from "@/pages/Login";
import DataTablePage from "./pages/DataTable";
import TaskPage from "./pages/TaskPage";
import ScriptPage from "./pages/ScriptPage";
import SettingsPage from "./pages/SettingsPage";
import MainLayout from "./Layout";
import Home from "./pages/Homepage";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter basename="/">
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="data-table" element={<DataTablePage />} />
            <Route path="login" element={<Login />} />
            <Route path="task" element={<TaskPage />} />
            <Route path="scripts" element={<ScriptPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  );
};

export default App;
