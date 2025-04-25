import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const StatusCard = ({ blueprintData, orchestrateData }) => {
  if (!blueprintData || !orchestrateData) {
    return (
      <Card className="min-w-150 shadow-2xl gap-0 py-4">
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent className="m-0 p-0 flex justify-center items-center text-xl text-red-500">
          Error: Data not fetched. Please login.
        </CardContent>
      </Card>
    );
  }

  const statusCount = (data, status) => {
    return data
      .filter((item) => item.status === status)
      .filter(
        (blueprint, index, self) =>
          index === self.findIndex((b) => b.name === blueprint.name)
      ).length;
  };

  const cbSuccessCount = statusCount(blueprintData, "SUCCESS");
  const cbInProgressCount = statusCount(blueprintData, "IN_PROGRESS");
  const cbFailedCount = statusCount(blueprintData, "FAILED");
  const oSuccessCount = statusCount(orchestrateData, "SUCCESS");
  const oInProgressCount = statusCount(orchestrateData, "IN_PROGRESS");
  const oFailedCount = statusCount(orchestrateData, "FAILED");

  return (
    <Card className="min-w-150 shadow-2xl gap-0">
      <CardHeader>
        <CardTitle>Status</CardTitle>
      </CardHeader>
      <CardContent className="m-0 p-0 flex text-3xl gap-2 px-4 py-2 font-medium text-gray-700">
        {blueprintData && orchestrateData && (
          <>
            <div>
              <span>Create Blueprint</span>
              <div className="flex flex-col gap-4">
                <span className="text-green-500">
                  Success: {cbSuccessCount}
                </span>
                <span className="text-red-500">Failed: {cbFailedCount}</span>
                <span className="text-yellow-500">
                  In Progress: {cbInProgressCount}
                </span>
              </div>
            </div>
            <Separator
              orientation="vertical"
              className="bg-gray-300 w-[1px] mx-10 h-full"
            />
            <div>
              <span>Orchestrate</span>
              <div className="flex flex-col gap-4">
                <span className="text-green-500">Success: {oSuccessCount}</span>
                <span className="text-red-500">Failed: {oFailedCount}</span>
                <span className="text-yellow-500">
                  In Progress: {oInProgressCount}
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StatusCard;
