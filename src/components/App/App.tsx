import { AppShell, Text } from "@mantine/core";
import { useState } from "react";
import { useProjects } from "@context/ProjectsContext";
import ProjectListNavbar from "@components/ProjectListNavbar";
import AppShellHeader from "@components/AppShellHeader";
import ProjectPage from "@components/ProjectPage";

function App() {
  const { projects } = useProjects();
  const [navbarOpened, setNavbarOpened] = useState(false);
  const [selectedProject, setSelectedProject] = useState(projects[0]);

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
