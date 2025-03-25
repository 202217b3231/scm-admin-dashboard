import DataTable from "./DataTable";
import Navbar from "./Navbar";
import Form from "./Form";
import Settings from "./Settings";
import React, { useState, useCallback, useEffect } from "react";

function App() {
  return (
    <>
      <Navbar />
      <Form />

      <DataTable />
      <Settings />
    </>
  );
}

export default App;
