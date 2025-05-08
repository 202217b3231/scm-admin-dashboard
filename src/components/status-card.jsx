import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogTrigger,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { View } from "lucide-react";

import { useState } from "react";
const StatusCard = ({
  blueprintData,
  orchestrateData,
  onStatusClick,
  versions,
}) => {
  if (!blueprintData || !orchestrateData) {
    return (
      <Card className="min-w-150 shadow-2xl rounded-sm gap-0 py-4">
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
  const handleStatusClick = (status) => {
    if (onStatusClick) {
      onStatusClick(status);
    }
  };
  const cbSuccessCount = statusCount(blueprintData, "SUCCESS");
  const cbInProgressCount = statusCount(blueprintData, "IN_PROGRESS");
  const cbFailedCount = statusCount(blueprintData, "FAILED");
  const oSuccessCount = statusCount(orchestrateData, "SUCCESS");
  const oInProgressCount = statusCount(orchestrateData, "IN_PROGRESS");
  const oFailedCount = statusCount(orchestrateData, "FAILED");

  return (
    <Card className="w-150 rounded-sm">
      <CardHeader>
        <CardTitle>Status</CardTitle>
      </CardHeader>
      <CardContent className="font-medium flex text-xl gap-2 text-gray-700">
        {blueprintData && orchestrateData && (
          <div className="flex flex-col gap-0 w-full">
            <span>Create Blueprint</span>
            <div className="flex gap-1 justify-around">
              <span
                className="text-green-500 hover:cursor-pointer"
                onClick={() => handleStatusClick("SUCCESS")}
              >
                Success: {cbSuccessCount}
              </span>
              <span
                className="text-red-500 hover:cursor-pointer"
                onClick={() => handleStatusClick("FAILED")}
              >
                Failed: {cbFailedCount}
              </span>
              <span
                className="text-yellow-500 hover:cursor-pointer"
                onClick={() => handleStatusClick("IN_PROGRESS")}
              >
                In Progress: {cbInProgressCount}
              </span>
            </div>
            <Separator className="bg-gray-300 h-[1px] my-1 w-full" />
            <div>
              <span>Orchestrate</span>
              <div className="flex gap-1 justify-around">
                <span
                  className="text-green-500 hover:cursor-pointer"
                  onClick={() => handleStatusClick("SUCCESS")}
                >
                  Success: {oSuccessCount}
                </span>
                <span
                  className="text-red-500 hover:cursor-pointer"
                  onClick={() => handleStatusClick("FAILED")}
                >
                  Failed: {oFailedCount}
                </span>
                <span
                  className="text-yellow-500 hover:cursor-pointer"
                  onClick={() => handleStatusClick("IN_PROGRESS")}
                >
                  In Progress: {oInProgressCount}
                </span>
              </div>
            </div>
            <Separator className="bg-gray-300 h-[1px] my-1 w-full" />
            <div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className="flex items-center gap-2">
                    <span>RHEL Versions</span>
                    <View className="hover:cursor-pointer m-2" size={24} />
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogTitle>RHEL AMI Versions</AlertDialogTitle>
                  <AlertDialogDescription>
                    Below are the available RHEL AMI versions extracted from the
                    data.
                  </AlertDialogDescription>
                  {Object.entries(versions).map(([key, value]) => (
                    <p key={key}>{value.toUpperCase() || key.toUpperCase()}</p>
                  ))}
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatusCard;
