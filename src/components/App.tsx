import Content from "@/components/Content";
import { ProjectsProvider } from "@/context/ProjectsContext";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useLocalStorageValue } from "@mantine/hooks";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";

export default function App() {
  const [colorScheme, setColorScheme] = useLocalStorageValue<ColorScheme>({
    key: "mantineColorScheme",
    defaultValue: "light",
  });
  const [primaryColor, setPrimaryColor] = useLocalStorageValue<string>({
    key: "mantinePrimaryColor",
    defaultValue: "blue",
  });
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "light" ? "dark" : "light"));

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme, primaryColor, other: { setPrimaryColor } }}
        withGlobalStyles
      >
        <ProjectsProvider>
          <NotificationsProvider>
            <ModalsProvider>
              <Content />
            </ModalsProvider>
          </NotificationsProvider>
        </ProjectsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
