import {
  AppShell,
  Text,
  Header,
  MediaQuery,
  Burger,
  Group,
  Button,
  Anchor,
  LoadingOverlay,
} from "@mantine/core";
import { useState } from "react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useProjects } from "@context/ProjectsContext";
import { ipcRenderer } from "electron";
import ReactMarkdown from "react-markdown";
import { useDidUpdate } from "@mantine/hooks";
import useLimitedArray from "@hooks/useLimitedArray";
import ProjectListNavbar from "@components/ProjectListNavbar";

interface ReadmeCacheEntry {
  projectId: string;
  rawText: string;
}

function App() {
  const { projects } = useProjects();
  const [readmeRaw, setReadmeRaw] = useState("Loading...");
  const [navbarOpened, setNavbarOpened] = useState(false);
  const [readmeLoading, setReadmeLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const { array: readmeCache, addItem: addReadmeCacheEntry } =
    useLimitedArray<ReadmeCacheEntry>([], 5);

  // This hook makes sure the function is only run once when the component is mounted
  useDidUpdate(() => {
    // if the selected projects README text is stored in the cache, just use that
    const entry = readmeCache.find((e) => e.projectId == selectedProject.id);
    if (entry) {
      setReadmeRaw(entry.rawText);
      return;
    }
    // otherwise, fetch the README text from the folder
    setReadmeLoading(true);
    ipcRenderer.invoke("getReadme", selectedProject.rootDir).then((readme) => {
      const readmeText = readme ?? "No README.md found";
      addReadmeCacheEntry({
        projectId: selectedProject.id,
        rawText: readmeText,
      });
      setReadmeRaw(readmeText);
      setReadmeLoading(false);
    });
  }, [selectedProject]);

  // TODO: on edit list, display as list of checkbox buttons and change Add button to Delete button
  // consider adding a checkbox whose visibility is conditional on whether edit mode is enabled
  // for button on-click, check edit mode in function, or change function based on edit mode?

  return (
    <AppShell
      navbarOffsetBreakpoint={"sm"}
      fixed
      navbar={
        <ProjectListNavbar
          hidden={!navbarOpened}
          onProjectCreate={(p) => setSelectedProject(p)}
          onProjectClick={(p) => {
            setSelectedProject(p);
            setNavbarOpened(false);
          }}
        />
      }
      header={
        <Header height={70} padding={"md"}>
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <Group>
              <MediaQuery largerThan={"sm"} styles={{ display: "none" }}>
                <Burger
                  opened={navbarOpened}
                  onClick={() => setNavbarOpened((o) => !o)}
                  size={"sm"}
                  mr={"xl"}
                />
              </MediaQuery>
              <Text>Dashboard</Text>
            </Group>
          </div>
        </Header>
      }
    >
      {selectedProject && projects.find((p) => p.id === selectedProject.id) ? (
        <>
          <Group position={"apart"}>
            <Text weight={"bold"} size={"xl"}>
              {selectedProject.name}
            </Text>
            {selectedProject.url && (
              <Button
                onClick={async () =>
                  await ipcRenderer.invoke("openExternal", selectedProject.url)
                }
                variant={"subtle"}
                color={"gray"}
                leftIcon={<GitHubLogoIcon />}
              >
                View on GitHub
              </Button>
            )}
          </Group>
          <Anchor
            onClick={async () =>
              await ipcRenderer.invoke("openPath", selectedProject.rootDir)
            }
            size={"sm"}
            color={"dimmed"}
          >
            {selectedProject.rootDir}
          </Anchor>
          <Text mt={"md"} size={"sm"} color={"dimmed"}>
            Description
          </Text>
          <Text>{selectedProject.description}</Text>
          <div
            style={{
              position: "relative",
              height: readmeLoading ? "100%" : "auto",
            }}
          >
            <LoadingOverlay visible={readmeLoading} />
            <ReactMarkdown
              components={{ a: (props) => <a target={"_blank"} {...props} /> }}
            >
              {readmeRaw}
            </ReactMarkdown>
          </div>
        </>
      ) : (
        <Text color={"dimmed"}>No project selected</Text>
      )}
    </AppShell>
  );
}

export default App;
