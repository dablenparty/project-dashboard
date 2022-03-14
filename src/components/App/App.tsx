import Content from "@components/Content";
import { ProjectsProvider } from "@context/ProjectsContext";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { useState } from "react";

export default function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "light" ? "dark" : "light"));

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider theme={{ colorScheme }} withGlobalStyles>
        <ProjectsProvider>
          <ModalsProvider>
            <Content />
          </ModalsProvider>
        </ProjectsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
