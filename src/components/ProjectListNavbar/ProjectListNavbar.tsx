import ProjectForm from "@components/ProjectForm";
import { useProjects } from "@context/ProjectsContext";
import {
  ActionIcon,
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
      sx={{ height: "auto" }}
    >
      <Navbar.Section grow>
        <Group position={"apart"} spacing={0} mb={"xs"}>
          <TextInput
            sx={{
              flexGrow: 1,
            }}
            placeholder={"Search for a project"}
            value={projectSearchText}
            icon={<MagnifyingGlassIcon />}
            onChange={(event) => setProjectSearchText(event.target.value)}
            type={"search"}
          />
          <ActionIcon ml={"sm"} onClick={openProjectFormModal}>
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
              <UnstyledButton
                key={project.id}
                sx={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 4,
                  ":hover": {
                    backgroundColor:
                      theme.colorScheme === "light"
                        ? theme.colors.gray[1]
                        : theme.colors.gray[9],
                    color: theme.colors[theme.primaryColor][6],
                  },
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
                  color={"dimmed"}
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
