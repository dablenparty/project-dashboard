import ProjectForm from "@components/ProjectForm";
import { useProjects } from "@context/ProjectsContext";
import {
  Button,
  Group,
  Navbar,
  ScrollArea,
  Text,
  TextInput,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import Project from "@models/Project";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

type ListNavbarProps = {
  hidden: boolean;
  onProjectCreate?: (project: Project) => void;
  onProjectClick?: (project: Project) => void;
};

export default function ListNavbar({
  hidden,
  onProjectCreate = () => undefined,
  onProjectClick = () => undefined,
}: ListNavbarProps) {
  const modals = useModals();
  const theme = useMantineTheme();
  const { projects, addProject } = useProjects();
  const [projectSearchText, setProjectSearchText] = useState("");

  const openProjectFormModal = () => {
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
      padding={"sm"}
      hiddenBreakpoint={"sm"}
      hidden={hidden}
      width={{ sm: 300, lg: 400 }}
    >
      <Navbar.Section grow>
        <TextInput
          placeholder={"Search for a project"}
          value={projectSearchText}
          icon={<MagnifyingGlassIcon />}
          onChange={(event) => setProjectSearchText(event.target.value)}
          type={"search"}
          mb={"xs"}
        />
        <Group grow spacing={"xs"} mb={"xs"}>
          <Button onClick={openProjectFormModal}>Add</Button>
          <Button>Edit</Button>
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
              <UnstyledButton
                key={project.id}
                sx={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 4,
                  ":hover": { backgroundColor: theme.colors.gray[1] },
                }}
                onClick={() => onProjectClick(project)}
              >
                <Text>{project.name}</Text>
                {/* https://stackoverflow.com/questions/3922739/limit-text-length-to-n-lines-using-css */}
                <Text
                  sx={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    lineClamp: 1,
                    WebkitBoxOrient: "vertical",
                  }}
                  size={"sm"}
                  color={theme.colors.gray[6]}
                >
                  {project.description}
                </Text>
              </UnstyledButton>
            ))}
        </ScrollArea>
      </Navbar.Section>
    </Navbar>
  );
}
