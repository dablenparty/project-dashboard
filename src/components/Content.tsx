import { AppShell, Text } from "@mantine/core";
import { useState } from "react";
import ProjectListNavbar from "@/components/ProjectListNavbar";
import AppShellHeader from "@/components/AppShellHeader";
import ProjectPage from "@/components/ProjectPage";
import useLimitedArray from "@/hooks/useLimitedArray";
import { useDidUpdate } from "@mantine/hooks";
import Project from "@/models/Project";
import { readTextFile } from "@tauri-apps/api/fs";
import { path } from "@tauri-apps/api";

interface ReadmeCacheEntry {
  projectId: string;
  rawText: string;
}

function Content() {
  const [readmeRaw, setReadmeRaw] = useState<string>("Loading...");
  const [navbarOpened, setNavbarOpened] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(
    undefined
  );
  const { array: readmeCache, addItem: addReadmeCacheEntry } =
    useLimitedArray<ReadmeCacheEntry>([], 5);

  // This hook ensures that the component is loaded before running the provided code in a useEffect hook
  useDidUpdate(() => {
    if (!selectedProject) {
      return;
    }
    // if the selected projects README text is stored in the cache, just use that
    const entry = readmeCache.find((e) => e.projectId == selectedProject.id);
    if (entry) {
      setReadmeRaw(entry.rawText);
      return;
    }
    // otherwise, fetch the README text from the folder
    path.join(selectedProject.rootDir, "README.md").then((path) => {
      readTextFile(path).then((readme) => {
        const readmeText = readme ?? undefined;
        addReadmeCacheEntry({
          projectId: selectedProject.id,
          rawText: readmeText,
        });
        setReadmeRaw(readmeText);
      });
    });
  }, [selectedProject]);

  const projectPageComponent = selectedProject ? (
    <ProjectPage
      readmeText={readmeRaw}
      project={selectedProject}
      onProjectChange={(p) => setSelectedProject(p)}
      onProjectDelete={() => setSelectedProject(undefined)}
    />
  ) : (
    <Text color={"dimmed"}>No project selected</Text>
  );

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
      {projectPageComponent}
    </AppShell>
  );
}

export default Content;
