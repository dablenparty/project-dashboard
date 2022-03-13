import {
  AppShell,
  Text,
  Navbar,
  Header,
  MediaQuery,
  Burger,
  Group,
  ScrollArea,
  UnstyledButton,
  useMantineTheme,
  Button,
  TextInput,
  Anchor,
  LoadingOverlay,
} from "@mantine/core";
import { useState } from "react";
import {
  GitHubLogoIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import ProjectForm from "@components/ProjectForm";
import { useProjects } from "@context/ProjectsContext";
import { v4 as uuidv4 } from "uuid";
import { useModals } from "@mantine/modals";
import { ipcRenderer } from "electron";
import ReactMarkdown from "react-markdown";
import { useDidUpdate } from "@mantine/hooks";
import useLimitedArray from "@hooks/useLimitedArray";

interface ReadmeCacheEntry {
  projectId: string;
  rawText: string;
}

function App() {
  const modals = useModals();
  const theme = useMantineTheme();
  const { projects, addProject } = useProjects();
  const [readmeRaw, setReadmeRaw] = useState("Loading...");
  const [navbarOpened, setNavbarOpened] = useState(false);
  const [readmeLoading, setReadmeLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [projectSearchText, setProjectSearchText] = useState("");
  const { array: readmeCache, addItem: addReadmeCacheEntry } =
    useLimitedArray<ReadmeCacheEntry>([], 5);

  // This hook makes sure the function is only run once when the component is mounted
  useDidUpdate(() => {
    // if the selected projects README text is stored in the cache, just use that
    const entry = readmeCache.find((e) => e.projectId == selectedProject.id);
    if (entry) {
      setReadmeRaw(entry.rawText);
      return;
    }
    // otherwise, fetch the README text from the folder
    setReadmeLoading(true);
    ipcRenderer.invoke("getReadme", selectedProject.rootDir).then((readme) => {
      const readmeText = readme ?? "No README.md found";
      addReadmeCacheEntry({
        projectId: selectedProject.id,
        rawText: readmeText,
      });
      setReadmeRaw(readmeText);
      setReadmeLoading(false);
    });
  }, [selectedProject]);

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

  // TODO: on edit list, display as list of checkbox buttons and change Add button to Delete button
  // consider adding a checkbox whose visibility is conditional on whether edit mode is enabled
  // for button on-click, check edit mode in function, or change function based on edit mode?

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
                    p.name
                      .toLowerCase()
                      .includes(projectSearchText.toLowerCase())
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
      }
      header={
        <Header height={70} padding={"md"}>
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
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
          </div>
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
          <div
            style={{
              position: "relative",
              height: readmeLoading ? "100%" : "auto",
            }}
          >
            <LoadingOverlay visible={readmeLoading} />
            <ReactMarkdown
              components={{ a: (props) => <a target={"_blank"} {...props} /> }}
            >
              {readmeRaw}
            </ReactMarkdown>
          </div>
        </>
      ) : (
        <Text color={"dimmed"}>No project selected</Text>
      )}
    </AppShell>
  );
}

export default App;
