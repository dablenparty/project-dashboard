import { AppShell, Text } from "@mantine/core";
import { useState } from "react";
import { useProjects } from "@context/ProjectsContext";
import ProjectListNavbar from "@components/ProjectListNavbar";
import AppShellHeader from "@components/AppShellHeader";
import ProjectPage from "@components/ProjectPage";
import useLimitedArray from "@hooks/useLimitedArray";
import { ipcRenderer } from "electron";
import { useDidUpdate } from "@mantine/hooks";

type ReadmeCacheEntry = {
  projectId: string;
  rawText: string;
};

function App() {
  const { projects } = useProjects();
  const [readmeRaw, setReadmeRaw] = useState("Loading...");
  const [navbarOpened, setNavbarOpened] = useState(false);
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const { array: readmeCache, addItem: addReadmeCacheEntry } =
    useLimitedArray<ReadmeCacheEntry>([], 5);

  // This hook ensures that the component is loaded before running the provided code in a useEffect hook
  useDidUpdate(() => {
    // if the selected projects README text is stored in the cache, just use that
    const entry = readmeCache.find((e) => e.projectId == selectedProject.id);
    if (entry) {
      setReadmeRaw(entry.rawText);
      return;
    }
    // otherwise, fetch the README text from the folder
    ipcRenderer.invoke("getReadme", selectedProject.rootDir).then((readme) => {
      const readmeText = readme ?? "No README.md found";
      addReadmeCacheEntry({
        projectId: selectedProject.id,
        rawText: readmeText,
      });
      setReadmeRaw(readmeText);
    });
  }, [selectedProject]);

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
        <AppShellHeader
          title={"Dashboard"}
          burgerOpened={navbarOpened}
          onBurgerClick={() => setNavbarOpened((o) => !o)}
        />
      }
    >
      {selectedProject && projects.find((p) => p.id === selectedProject.id) ? (
        <ProjectPage
          readmeText={readmeRaw}
          project={selectedProject}
          onProjectChange={(p) => setSelectedProject(p)}
        />
      ) : (
        <Text color={"dimmed"}>No project selected</Text>
      )}
    </AppShell>
  );
}

export default App;
