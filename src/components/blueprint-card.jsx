import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

const BlueprintCard = ({
  title,
  blueprints,
  handleRowClick,
  fetchBlueprints,
  isAmi,
  searchTerm: externalSearchTerm,
  setSearchTerm: externalSetSearchTerm,
}) => {
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const searchTerm = externalSearchTerm ?? localSearchTerm;
  const setSearchTerm = externalSetSearchTerm ?? setLocalSearchTerm;

  const handleFetchBlueprints = async () => {
    setIsFetching(true);
    setFetchError(null);
    try {
      await fetchBlueprints();
    } catch (error) {
      setFetchError("Failed to fetch blueprints. Please try again.");
    } finally {
      setIsFetching(false);
    }
  };

  const filteredBlueprints = Array.isArray(blueprints)
    ? blueprints
        ?.filter((blueprint) => {
          const filters = (searchTerm || "")
            .toLowerCase()
            .split(",")
            .map((term) => term.trim().toLowerCase());
          return filters.some(
            (filter) =>
              blueprint?.name.toLowerCase().includes(filter) ||
              blueprint?.status.toLowerCase().includes(filter)
          );
        })
        .filter(
          (blueprint, index, self) =>
            index === self.findIndex((b) => b.name === blueprint.name)
        )
    : [];

  const handleRowSelection = (blueprint, index) => {
    setSelectedRowIndex(index);
    handleRowClick(blueprint.stages, blueprint.name);
  };

  return (
    <Card className="w-150 shadow-xl gap-0 rounded-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="min-w-fit">{title}</span>
          <div className="flex relative items-center gap-2 w-full">
            <Input
              list="suggestions"
              placeholder="Search"
              className="p-1 border border-gray-300 rounded-lg w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="icon"
                onClick={() => setSearchTerm("")}
                className="absolute right-20 top-1/2 transform -translate-y-1/2 hover:text-gray-700"
              >
                <span className="text-3xl mb-2">&times;</span>
              </Button>
            )}
            {!isAmi && (
              <Button
                variant="icon"
                onClick={handleFetchBlueprints}
                disabled={isFetching}
              >
                <span className="text-xl">{isFetching ? "⏳" : "🔄"}</span>
              </Button>
            )}
          </div>

          <datalist id="suggestions">
            <option value="IN_PROGRESS" />
            <option value="Failed" />
            <option value="Success" />
          </datalist>
        </CardTitle>
      </CardHeader>
      <CardContent className="m-0 p-0">
        {fetchError && (
          <div className="text-red-500 text-sm p-2">{fetchError}</div>
        )}
        <ScrollArea className="h-50 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Started</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBlueprints.map((blueprint, index) => (
                <TableRow
                  onClick={() => handleRowSelection(blueprint, index)}
                  className={`hover:bg-blue-100 hover:cursor-pointer ${
                    selectedRowIndex === index ? "bg-blue-200" : ""
                  }`}
                  key={index}
                >
                  <TableCell>
                    {new Date(blueprint?.startTimeMillis).toLocaleString(
                      "en-US",
                      {
                        day: "2-digit",
                        month: "short",
                        hour: "numeric",
                        hour12: true,
                      }
                    )}
                  </TableCell>
                  <TableCell>{blueprint?.status}</TableCell>
                  <TableCell>{blueprint?.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default BlueprintCard;
