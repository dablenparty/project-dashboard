import ProjectForm from "@components/ProjectForm";
import ProjectNavbarCard from "@components/ProjectNavbarCard";
import { useProjects } from "@context/ProjectsContext";
import {
  ActionIcon,
  Group,
  Navbar,
  ScrollArea,
  TextInput,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import Project from "@models/Project";
import { MagnifyingGlassIcon, PlusIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

type ProjectListNavbarProps = {
  hidden: boolean;
  onProjectCreate?: (project: Project) => void;
  onProjectClick?: (project: Project) => void;
};

export default function ProjectListNavbar({
  hidden,
  onProjectCreate = () => undefined,
  onProjectClick = () => undefined,
}: ProjectListNavbarProps) {
  const modals = useModals();
  const { projects, addProject } = useProjects();
  const [projectSearchText, setProjectSearchText] = useState("");

  const openAddProjectModal = () => {
    const modalId = modals.openModal({
      title: "Add a project",
      children: (
        <ProjectForm
          onSubmit={(values) => {
            const newProject = { id: uuidv4(), ...values };
            addProject(newProject);
            onProjectCreate(newProject);
            modals.closeModal(modalId);
          }}
        />
      ),
    });
  };

  return (
    <Navbar
      p={"sm"}
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
          <ActionIcon ml={"sm"} onClick={openAddProjectModal}>
            <PlusIcon />
          </ActionIcon>
        </Group>
        <ScrollArea>
          {projects
            .filter(
              (p) =>
                p.description
                  .toLowerCase()
                  .includes(projectSearchText.toLowerCase()) ||
                p.name.toLowerCase().includes(projectSearchText.toLowerCase())
            )
            .map((project) => (
              <ProjectNavbarCard
                project={project}
                key={project.id}
                onCardClick={(p) => onProjectClick(p)}
              />
            ))}
        </ScrollArea>
      </Navbar.Section>
    </Navbar>
  );
}
