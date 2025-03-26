import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="flex">
        <div className="hidden md:block h-[100vh] w-[130px]">
          <Sidebar />
        </div>
        <div className="w-full md:max-w-[1140px] p-5">{children}</div>
      </div>
      <Toaster />
      {children}
    </>
  );
};

export default MainLayout;
