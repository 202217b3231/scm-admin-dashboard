import React, { useState } from "react";
import BlueprintCard from "../components/blueprint-card";
import StatusCard from "../components/status-card";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ErrorCard from "../components/error-card";

const Home = () => {
  const [selectedStages, setSelectedStages] = useState([]);
  const [selectedName, setSelectedName] = useState("");
  const [errors, setErrors] = useState([]);
  const [isLoadingErrors, setIsLoadingErrors] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [consoleLink, setConsoleLink] = useState("");

  const {
    data: blueprintData,
    isLoading: isBlueprintLoading,
    isError: isBlueprintError,
  } = useQuery({
    queryFn: () =>
      fetchData(
        "https://jenkins.eat.jnj.com/jetv-dev/job/CLOUDxBlueprintFactory/job/2_CreateBlueprint/wfapi/runs"
      ),
    queryKey: ["blueprints"],
  });

  const {
    data: orchestrateData,
    isLoading: isOrchestrateLoading,
    isError: isOrchestrateError,
  } = useQuery({
    queryFn: () =>
      fetchData(
        "https://jenkins.eat.jnj.com/jetv-dev/job/CLOUDxBlueprintFactory/job/1_Orchestrate/wfapi/runs"
      ),
    queryKey: ["orchestrate"],
  });

  async function fetchData(url) {
    return fetch(url).then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      return response.json();
    });
  }

  const handleRowClick = (stages, name) => {
    setSelectedStages(stages);
    setSelectedName(name);

    const selectedBlueprint = (blueprintData || []).find(
      (blueprint) => blueprint.name === name
    );

    if (selectedBlueprint) {
      setConsoleLink(
        `https://jenkins.eat.jnj.com/jetv-dev/job/CLOUDxBlueprintFactory/job/2_CreateBlueprint/${selectedBlueprint.id}/consoleText`
      );
      fetchErrors(consoleLink);
    }
  };

  const fetchErrors = async (link) => {
    setIsLoadingErrors(true);
    setFetchError(null);
    setErrors([]);
    try {
      const response = await fetch(link);
      if (!response.ok) {
        throw new Error("Failed to fetch console text");
      }
      const text = await response.text();
      const errorLines = text
        .split("\n")
        .filter((line) => line.toLowerCase().includes("error:"));
      if (errorLines.length > 0) {
        setErrors(errorLines);
      } else {
        setFetchError("No errors found or check logs.");
      }
    } catch (error) {
      setFetchError("Failed to fetch errors. Please try again.");
    } finally {
      setIsLoadingErrors(false);
    }
  };

  return (
    <div className="pl-4">
      <div className="flex pb-2 mt-0 justify-center gap-2">
        <Tabs defaultValue="blueprint">
          <TabsList>
            <TabsTrigger value="blueprint">Blueprint</TabsTrigger>
            <TabsTrigger value="orchestrate">Orchestrate</TabsTrigger>
          </TabsList>
          <TabsContent value="blueprint">
            <BlueprintCard
              title="Create Blueprints"
              blueprints={blueprintData || []}
              handleRowClick={handleRowClick}
              fetchBlueprints={() =>
                fetchData(
                  "https://jenkins.eat.jnj.com/jetv-dev/job/CLOUDxBlueprintFactory/job/2_CreateBlueprint/wfapi/runs"
                )
              }
            />
          </TabsContent>
          <TabsContent value="orchestrate">
            <BlueprintCard
              title="Orchestrate"
              blueprints={orchestrateData || []}
              handleRowClick={handleRowClick}
              fetchBlueprints={() =>
                fetchData(
                  "https://jenkins.eat.jnj.com/jetv-dev/job/CLOUDxBlueprintFactory/job/1_Orchestrate/wfapi/runs"
                )
              }
            />
          </TabsContent>
        </Tabs>
        <BlueprintCard
          title={selectedName || "Selected Blueprint"}
          blueprints={selectedStages}
          isAmi={true}
        />
      </div>
      <div className="flex h-60 gap-2">
        <ErrorCard
          title={selectedName || "Selected Blueprint"}
          errors={errors}
          isLoading={isLoadingErrors}
          fetchError={fetchError}
          consoleLink={consoleLink}
        />
        <StatusCard
          blueprintData={blueprintData}
          orchestrateData={orchestrateData}
        />
      </div>
    </div>
  );
};

export default Home;
