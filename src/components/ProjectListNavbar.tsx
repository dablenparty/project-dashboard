import AddMenu from "@components/AddMenu";
import MultiProjectForm from "@components/MultiProjectForm";
import ProjectForm from "@components/ProjectForm";
import ProjectNavbarCard from "@components/ProjectNavbarCard";
import { useProjects } from "@context/ProjectsContext";
import { Group, Navbar, ScrollArea, TextInput } from "@mantine/core";
import { useModals } from "@mantine/modals";
import Project from "@models/Project";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useState } from "react";

interface ProjectListNavbarProps {
  hidden: boolean;
  onProjectCreate?: (project: Project) => void;
  onProjectClick?: (project: Project) => void;
}

/**
 * Works like a case-insensitive `string.includes()`
 *
 * Examples:
 * - `("foo", "f")` => `true`
 * - `("foo", "F")` => `true`
 * - `("fOo", "oo")` => `true`
 *
 * @param s string to search through
 * @param substr substring to search for
 * @returns `true` if `substr` is found in `s`, `false` otherwise
 */
function caseInsensitiveIncludes(s: string, substr: string) {
  return s.toLowerCase().includes(substr.toLowerCase());
}

export default function ProjectListNavbar({
  hidden,
  onProjectCreate,
  onProjectClick,
}: ProjectListNavbarProps) {
  const modals = useModals();
  const { projects } = useProjects();
  const [projectSearchText, setProjectSearchText] = useState("");

  const openAddOneProjectModal = () => {
    const modalId = modals.openModal({
      title: "Add a project",
      children: (
        <ProjectForm
          onSubmit={(newProject) => {
            onProjectCreate?.(newProject);
            modals.closeModal(modalId);
          }}
        />
      ),
    });
  };

  const openAddMultipleProjectsModal = () => {
    const modalId = modals.openModal({
      title: "Add multiple projects",
      children: (
        <MultiProjectForm onSubmit={() => modals.closeModal(modalId)} />
      ),
    });
  };

  return (
    <Navbar
      p={"sm"}
      pb={82}
      sx={{
        overflowY: "auto",
      }}
      hiddenBreakpoint={"sm"}
      hidden={hidden}
      width={{ sm: 300, lg: 400 }}
      height={"100%"}
    >
      <Navbar.Section grow>
        <Group position={"apart"} spacing={0} mb={"xs"}>
          <TextInput
            sx={{ flexGrow: 1 }}
            placeholder={"Search for a project"}
            value={projectSearchText}
            icon={<MagnifyingGlassIcon />}
            onChange={(event) => setProjectSearchText(event.target.value)}
            type={"search"}
          />
          <AddMenu
            ml={"sm"}
            onAddOneClick={openAddOneProjectModal}
            onAddManyClick={openAddMultipleProjectsModal}
          />
        </Group>
        <ScrollArea>
          {projects
            .filter(
              (p) =>
                caseInsensitiveIncludes(p.description, projectSearchText) ||
                caseInsensitiveIncludes(p.name, projectSearchText)
            )
            .map((project) => (
              <ProjectNavbarCard
                project={project}
                key={project.id}
                onCardClick={(p) => onProjectClick?.(p)}
              />
            ))}
        </ScrollArea>
      </Navbar.Section>
    </Navbar>
  );
}
