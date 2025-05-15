import { useEffect, useState, useRef } from "react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import Editor from "@monaco-editor/react";

const TaskPage = () => {
  useDocumentTitle("Tasks");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const dialogRef = useRef(null);

  return (
    <div className="">
      <h2 className="text-2xl font-semibold mb-6">Task Options</h2>
      <button
        className="linkBtn flex justify-between items-center"
        onClick={() => dialogRef.current.show()}
      >
        Edit Tasks
        <span className="ml-1 text-xl">▶&#65038;</span>
      </button>

      <dialog ref={dialogRef} className="m-auto">
        <Editor
          width={500}
          className="h-40 rounded"
          theme="vs-dark"
          defaultLanguage="javascript"
          value={query}
          onChange={(value) => setQuery(value || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
          }}
        />
        <button className="linkBtn " onClick={() => dialogRef.current.close()}>
          Cancel
        </button>
      </dialog>
    </div>
  );
};

export default TaskPage;
