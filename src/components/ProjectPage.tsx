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
import { GitHubLogoIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { ipcRenderer } from "electron";
import ReactMarkdown from "react-markdown";

interface ProjectPageProps {
  project: Project;
  readmeText?: string;
  onProjectChange?: (project: Project) => void;
  onProjectDelete?: (projectId: string) => void;
}

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
  onProjectChange,
  onProjectDelete,
}: ProjectPageProps) {
  const theme = useMantineTheme();
  const modals = useModals();
  const { editProject, deleteProject } = useProjects();

  const openEditProjectModal = () => {
    const modalId = modals.openModal({
      title: "Edit project",
      children: (
        <ProjectForm
          project={project}
          onSubmit={(values) => {
            const newProject = { ...project, ...values };
            editProject(newProject);
            onProjectChange?.(newProject);
            modals.closeModal(modalId);
          }}
        />
      ),
    });
  };

  const githubIcon = project.url && (
    <ActionIcon
      sx={{
        "&:hover": {
          color: theme.colors[theme.primaryColor][6],
        },
      }}
      onClick={async () =>
        await ipcRenderer.invoke("openExternal", project.url)
      }
    >
      <GitHubLogoIcon />
    </ActionIcon>
  );

  const editIcon = (
    <ActionIcon
      sx={{
        "&:hover": {
          color: theme.colors[theme.primaryColor][6],
        },
      }}
      onClick={openEditProjectModal}
    >
      <Pencil1Icon />
    </ActionIcon>
  );

  const deleteIcon = (
    <ActionIcon
      sx={{
        "&:hover": {
          color: theme.colors.red[6],
        },
      }}
      onClick={() => {
        const modalId = modals.openConfirmModal({
          title: `Delete ${project.name}?`,
          children: (
            <Text>
              Are you sure you want to delete this project? This action cannot
              be undone (this won't delete the project off your system, just
              from this app).
            </Text>
          ),
          labels: { confirm: "Delete", cancel: "Cancel" },
          confirmProps: {
            color: "red",
          },
          onConfirm: () => {
            deleteProject(project.id);
            onProjectDelete?.(project.id);
            modals.closeModal(modalId);
          },
          onCancel: () => modals.closeModal(modalId),
        });
      }}
    >
      <TrashIcon />
    </ActionIcon>
  );

  return (
    <>
      <Group position={"apart"}>
        <Text weight={"bold"} size={"xl"}>
          {project.name}
        </Text>
        <Group>
          {githubIcon}
          {editIcon}
          {deleteIcon}
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
      <Text mt={"md"} size={"sm"} color={"dimmed"}>
        README.md
      </Text>
      <div
        style={{
          position: "relative",
        }}
      >
        <ReactMarkdown
          components={{
            a: (props) => (
              <a
                target={"_blank"}
                style={{
                  color:
                    theme.colorScheme === "dark"
                      ? "cornflowerblue"
                      : "-webkit-link",
                }}
                {...props}
              />
            ),
          }}
        >
          {readmeText ?? "No README.md found"}
        </ReactMarkdown>
      </div>
    </>
  );
}
