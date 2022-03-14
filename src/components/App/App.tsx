import Content from "@components/Content";
import { ProjectsProvider } from "@context/ProjectsContext";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useLocalStorageValue } from "@mantine/hooks";
import { ModalsProvider } from "@mantine/modals";

export default function App() {
  const [colorScheme, setColorScheme] = useLocalStorageValue<ColorScheme>({
    key: "mantineColorScheme",
    defaultValue: "light",
  });
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
