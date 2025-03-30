import React, { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ScriptPage = () => {
  const [scripts, setScripts] = useState([]);
  const addScript = () => {
    setScripts([...scripts, { id: scripts.length + 1 }]);
  };
  return (
    <div className="ml-5">
      <Breadcrumb className="mt-1 mb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Scripts</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Button variant={"outline"} onClick={() => addScript()}>
        Add Script
      </Button>
      <Button variant={"outline"} onClick={() => setScripts([])}>
        Clear Scripts
      </Button>
      <ul>
        {scripts.map((script) => (
          <li key={script.id}>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default ScriptPage;
