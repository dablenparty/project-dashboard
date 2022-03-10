import React from "react";
import { render } from "react-dom";
import "./index.css";
import App from "./components/App";
import { MantineProvider } from "@mantine/core";
import { ProjectsProvider } from "./context/ProjectsContext";
import { ModalsProvider } from "@mantine/modals";

render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles>
      <ModalsProvider>
        <ProjectsProvider>
          <App />
        </ProjectsProvider>
      </ModalsProvider>
    </MantineProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
