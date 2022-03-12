import {
  AppShell,
  Text,
  Navbar,
  Header,
  MediaQuery,
  Burger,
  Group,
  ActionIcon,
  ScrollArea,
  UnstyledButton,
  useMantineTheme,
  Button,
  TextInput,
  Anchor,
} from "@mantine/core";
import { useState } from "react";
import { GitHubLogoIcon, PlusIcon } from "@radix-ui/react-icons";
import ProjectForm from "@components/ProjectForm";
import { useProjects } from "@context/ProjectsContext";
import { v4 as uuidv4 } from "uuid";
import { useModals } from "@mantine/modals";
import { ipcRenderer } from "electron";

function App() {
  const [navbarOpened, setNavbarOpened] = useState(false);
  const [projectSearchText, setProjectSearchText] = useState("");
  const modals = useModals();
  const theme = useMantineTheme();
  const { projects, addProject } = useProjects();
  const [selectedProject, setSelectedProject] = useState(projects[0]);

  const openProjectFormModal = () => {
    const modalId = modals.openModal({
      title: "Add a project",
      children: (
        <ProjectForm
          onSubmit={(values) => {
            const newProject = { id: uuidv4(), ...values };
            addProject(newProject);
            setSelectedProject(newProject);
            modals.closeModal(modalId);
          }}
        />
      ),
    });
  };

  return (
    <AppShell
      navbarOffsetBreakpoint={"sm"}
      fixed
      navbar={
        <Navbar
          padding={"sm"}
          hiddenBreakpoint={"sm"}
          hidden={!navbarOpened}
          width={{ sm: 300, lg: 400 }}
        >
          <Navbar.Section grow component={ScrollArea}>
            <TextInput
              placeholder={"Search for a project"}
              value={projectSearchText}
              onChange={(event) => setProjectSearchText(event.target.value)}
              type={"search"}
              mb={"xs"}
            />
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
                  onClick={() => {
                    setSelectedProject(project);
                    setNavbarOpened(false);
                  }}
                >
                  <Text>{project.name}</Text>
                  <Text size={"sm"} color={theme.colors.gray[6]}>
                    {project.description}
                  </Text>
                </UnstyledButton>
              ))}
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={70} padding={"md"}>
          <Group
            position={"apart"}
            sx={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <Group>
              <MediaQuery largerThan={"sm"} styles={{ display: "none" }}>
                <Burger
                  opened={navbarOpened}
                  onClick={() => setNavbarOpened((o) => !o)}
                  size={"sm"}
                  mr={"xl"}
                />
              </MediaQuery>
              <Text>Dashboard</Text>
            </Group>
            <ActionIcon onClick={openProjectFormModal}>
              <PlusIcon />
            </ActionIcon>
          </Group>
        </Header>
      }
    >
      {selectedProject && projects.find((p) => p.id === selectedProject.id) ? (
        <>
          <Group position={"apart"}>
            <Text weight={"bold"} size={"xl"}>
              {selectedProject.name}
            </Text>
            {selectedProject.url && (
              <Button
                onClick={async () =>
                  await ipcRenderer.invoke("openExternal", selectedProject.url)
                }
                variant={"subtle"}
                color={"gray"}
                leftIcon={<GitHubLogoIcon />}
              >
                View on GitHub
              </Button>
            )}
          </Group>
          <Anchor
            onClick={async () =>
              await ipcRenderer.invoke("openPath", selectedProject.rootDir)
            }
            size={"sm"}
            color={"dimmed"}
          >
            {selectedProject.rootDir}
          </Anchor>
          <Text mt={"md"} size={"sm"} color={"dimmed"}>
            Description
          </Text>
          <Text>{selectedProject.description}</Text>
        </>
      ) : (
        <Text color={"dimmed"}>No project selected</Text>
      )}
    </AppShell>
  );
}

export default App;
