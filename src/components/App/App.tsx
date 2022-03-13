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
        <AppShellHeader
          title={"Dashboard"}
          burgerOpened={navbarOpened}
          onBurgerClick={() => setNavbarOpened((o) => !o)}
        />
      }
    >
      {selectedProject && projects.find((p) => p.id === selectedProject.id) ? (
        <ProjectPage project={selectedProject} />
      ) : (
        <Text color={"dimmed"}>No project selected</Text>
      )}
    </AppShell>
  );
}

export default App;
