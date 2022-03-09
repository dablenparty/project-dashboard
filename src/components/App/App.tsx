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
} from "@mantine/core";
import "./App.css";
import { useState } from "react";
import { PlusIcon } from "@radix-ui/react-icons";
import ProjectForm from "src/components/ProjectForm";
import { useProjects } from "src/context/ProjectsContext";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [navbarOpened, setNavbarOpened] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);
  const [projectIndex, setProjectIndex] = useState(0);
  const theme = useMantineTheme();
  const projectsContext = useProjects();
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
            {projectsContext?.projects.map((project, index) => (
              <UnstyledButton
                key={project.id}
                sx={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 4,
                  ":hover": { backgroundColor: theme.colors.gray[1] },
                }}
                onClick={() => setProjectIndex(index)}
              >
                <Text>{project.name}</Text>
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
              <Text>Application header</Text>
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
      <Text>Selected index: {projectIndex}</Text>
    </AppShell>
  );
}

export default App;
