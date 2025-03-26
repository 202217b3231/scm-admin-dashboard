"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
const Settings = () => {
  const [jiraUrl, setJiraUrl] = useState(() => {
    const storedUrl = localStorage.getItem("jiraUrl");
    return storedUrl ? storedUrl : "https://jira.jnj.com";
  });
  const [snowUrl, setSnowUrl] = useState(() => {
    const storedUrl = localStorage.getItem("snowUrl");
    return storedUrl ? storedUrl : "https://jnjprod.service-now.com";
  });
  return (
    <>
      <div className="flex justify-evenly items-center gap-5">
        <Label>Jira URL</Label>
        <Input
          type="text"
          value={jiraUrl}
          onChange={(e) => setJiraUrl(e.target.value)}
        />
        <br />
        <Label>Snow URL</Label>
        <Input
          type="text"
          value={snowUrl}
          onChange={(e) => setSnowUrl(e.target.value)}
        />
      </div>
    </>
  );
};
export default Settings;
