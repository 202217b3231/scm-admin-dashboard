import DashboardCard from "@/components/dashboard/DashboardCard";
import { Newspaper, FileChartColumnIncreasing, Egg } from "lucide-react";

export default function Home() {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-around gap-5 mb-5">
        <DashboardCard
          title="News"
          count={10}
          icon={
            <Newspaper
              className="text-slate-500 dark:text-slate-200"
              size={36}
            />
          }
        />
        <DashboardCard
          title="Chart"
          count={10}
          icon={
            <FileChartColumnIncreasing
              className="text-slate-500 dark:text-slate-200"
              size={36}
            />
          }
        />
        <DashboardCard
          title="Egg"
          count={10}
          icon={
            <Egg className="text-slate-500 dark:text-slate-200" size={36} />
          }
        />
      </div>
    </>
  );
}
