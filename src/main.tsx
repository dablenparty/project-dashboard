import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
import { MantineProvider } from "@mantine/core";
import { ProjectsProvider } from "src/context/ProjectsContext";

ReactDOM.render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles>
      <ProjectsProvider>
        <App />
      </ProjectsProvider>
    </MantineProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
