import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
import { MantineProvider } from "@mantine/core";

ReactDOM.render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles>
      <App />
    </MantineProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
