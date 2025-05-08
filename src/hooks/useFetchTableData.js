import { useState, useCallback } from "react";

function useFetchTableData(columns) {
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const jiraUrl = "https://jira.jnj.com";
  const snowUrl = "https://jnjprod.service-now.com";

  const fetchTableData = useCallback(
    async (userId, startDate, endDate, setUsers, index) => {
      setLoading(true);
      setFetchError(null);

      const startDateFormatted = startDate
        ? `javascript:gs.dateGenerate('${startDate}', '00:00:00')`
        : "javascript:gs.beginningOfLastMonth()";
      const endDateFormatted = endDate
        ? `javascript:gs.dateGenerate('${endDate}', '23:59:59')`
        : "javascript:gs.endOfLastMonth()";

      const templateUrls = columns.map((col) => {
        if (col.tableName === "issuetable") {
          return `${jiraUrl}/issues/?filter=-1&jql=created >= ${startDate} AND created <= ${endDate} AND assignee in (${userId}) order by updated DESC`;
        } else {
          return `${snowUrl}/${col.tableName}_list.do?sysparm_query=assigned_to.user_name=${userId}^sys_created_onBETWEEN${startDateFormatted}@${endDateFormatted}`;
        }
      });

      // console.log("Generated template URLs:", templateUrls); // Log all generated URLs

      const newData = {};
      const fetchPromises = columns.map(async (col, idx) => {
        const colKey = col.key;
        if (colKey === "id") return Promise.resolve();
        try {
          const response = await fetch(templateUrls[idx]);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.text();
          console.log(`Response for column ${colKey}:`, data);
          const parser = new DOMParser();
          const doc = parser.parseFromString(data, "text/html");
          const element = doc.querySelector(`#${col.tableName} tbody`);
          newData[colKey] = element ? element.rows.length : 0;
          newData[colKey + "Url"] = templateUrls[idx];
        } catch (error) {
          console.log(`Error fetching data for column ${colKey}:`, error);
          newData[colKey] = "error";
          newData[colKey + "Url"] = null;
        }
      });

      try {
        await Promise.all(fetchPromises);
      } catch (error) {
        console.log("Error fetching table data:", error);
      } finally {
        setLoading(false);
      }

      if (typeof setUsers === "function") {
        setUsers((prevUsers) => {
          const updatedUsers = [...prevUsers];
          if (updatedUsers[index]) {
            updatedUsers[index] = {
              ...updatedUsers[index],
              data: { ...updatedUsers[index].data, ...newData },
            };
          }
          return updatedUsers;
        });
      } else {
        console.log("setUsers is not a function");
      }

      return newData;
    },
    [columns]
  );

  return { fetchTableData, fetchError, loading, setLoading };
}

export default useFetchTableData;
