import ProjectForm from "@components/ProjectForm";
import { useProjects } from "@context/ProjectsContext";
import {
  ActionIcon,
  Anchor,
  Group,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import Project from "@models/Project";
import { GitHubLogoIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { ipcRenderer } from "electron";
import ReactMarkdown from "react-markdown";

type ProjectPageProps = {
  project: Project;
  readmeText: string;
  onProjectChange?: (project: Project) => void;
};

/**
 * Creates a Project Page component.
 *
 * ## Important
 * `project` should be a state variable created by the `useState` hook
 *
 * @param project The project to display
 * @returns ProjectPage component
 */
export default function ProjectPage({
  project,
  readmeText,
  onProjectChange = () => undefined,
}: ProjectPageProps) {
  const theme = useMantineTheme();
  const modals = useModals();
  const { editProject } = useProjects();

  const openProjectFormModal = () => {
    const modalId = modals.openModal({
      title: "Edit project",
      children: (
        <ProjectForm
          project={project}
          onSubmit={(values) => {
            const newProject = { ...project, ...values };
            editProject(newProject);
            onProjectChange(newProject);
            modals.closeModal(modalId);
          }}
        />
      ),
    });
  };

  return (
    <>
      <Group position={"apart"}>
        <Text weight={"bold"} size={"xl"}>
          {project.name}
        </Text>
        <Group>
          {project.url && (
            <ActionIcon
              sx={{
                "&:hover": {
                  color: theme.colors[theme.primaryColor][6],
                },
              }}
              variant={"transparent"}
              onClick={async () =>
                await ipcRenderer.invoke("openExternal", project.url)
              }
            >
              <GitHubLogoIcon />
            </ActionIcon>
          )}
          <ActionIcon
            sx={{
              "&:hover": {
                color: theme.colors[theme.primaryColor][6],
              },
            }}
            onClick={openProjectFormModal}
            variant={"transparent"}
          >
            <Pencil1Icon />
          </ActionIcon>
        </Group>
      </Group>
      <Anchor
        onClick={async () =>
          await ipcRenderer.invoke("openPath", project.rootDir)
        }
        size={"sm"}
        color={"dimmed"}
      >
        {project.rootDir}
      </Anchor>
      <Text mt={"md"} size={"sm"} color={"dimmed"}>
        Description
      </Text>
      <Text>{project.description}</Text>
      <div
        style={{
          position: "relative",
        }}
      >
        <ReactMarkdown
          components={{ a: (props) => <a target={"_blank"} {...props} /> }}
        >
          {readmeText}
        </ReactMarkdown>
      </div>
    </>
  );
}
