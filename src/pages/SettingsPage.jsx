import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import Notes from "@/pages/NotePage";
const SettingsPage = () => {
  useDocumentTitle("Settings");

  return (
    <div className="flex w-full">
      <Notes />
    </div>
  );
};
export default SettingsPage;
