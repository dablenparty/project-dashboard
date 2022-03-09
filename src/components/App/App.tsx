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
  Modal,
  Button,
} from "@mantine/core";
import { useState } from "react";
import { GitHubLogoIcon, MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import ProjectForm from "src/components/ProjectForm";
import { useProjects } from "src/context/ProjectsContext";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [navbarOpened, setNavbarOpened] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);
  const theme = useMantineTheme();
  const projectsContext = useProjects();
  const [selectedProject, setSelectedProject] = useState(
    projectsContext?.projects[0]
  );
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
            {projectsContext?.projects.map((project) => (
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
                <Group position="apart">
                  <Text>{project.name}</Text>
                  <ActionIcon
                    color={"red"}
                    onClick={() => projectsContext?.deleteProject(project.id)}
                  >
                    <MinusIcon />
                  </ActionIcon>
                </Group>
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
            position="apart"
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
            <Modal
              opened={modalOpened}
              onClose={() => setModalOpened(false)}
              title={"Add a project"}
            >
              <ProjectForm
                onSubmit={(values) => {
                  const newProject = { id: uuidv4(), ...values };
                  projectsContext?.addProject(newProject);
                  setModalOpened(false);
                }}
                title={""}
              />
            </Modal>
            <ActionIcon onClick={() => setModalOpened(true)}>
              <PlusIcon />
            </ActionIcon>
          </Group>
        </Header>
      }
    >
      {selectedProject && (
        <>
          <Group position="apart">
            <Text weight={"bold"} size={"xl"}>
              {selectedProject.name}
            </Text>
            {selectedProject.url && (
              <Button
                component="a"
                href={selectedProject.url}
                target="_blank"
                variant={"subtle"}
                color={"gray"}
                leftIcon={<GitHubLogoIcon />}
              >
                View on GitHub
              </Button>
            )}
          </Group>
          <Text size={"sm"} color={theme.colors.gray[6]}>
            {selectedProject.rootDir}
          </Text>
        </>
      )}
    </AppShell>
  );
}

export default App;
