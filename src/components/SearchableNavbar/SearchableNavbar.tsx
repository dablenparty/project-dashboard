import { useProjects } from "@context/ProjectsContext";
import {
  Navbar,
  ScrollArea,
  Text,
  TextInput,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import Project from "@models/Project";
import { useState } from "react";

interface SearchableNavbarProps {
  onSelectProject: (project: Project) => void;
}

export default function SearchableNavbar({
  onSelectProject,
}: SearchableNavbarProps) {
  const [navbarOpened, setNavbarOpened] = useState(false);
  const [projectSearchText, setProjectSearchText] = useState("");
  const projectsContext = useProjects();
  const theme = useMantineTheme();

  return (
    <Navbar
      padding={"sm"}
      hiddenBreakpoint={"sm"}
      hidden={!navbarOpened}
      width={{ sm: 300, lg: 400 }}
    >
      <Navbar.Section grow component={ScrollArea}>
        <TextInput
          placeholder="Search for a project"
          value={projectSearchText}
          onChange={(event) => setProjectSearchText(event.target.value)}
          type={"search"}
          mb={"xs"}
        />
        {projectsContext?.projects
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
                onSelectProject(project);
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
  );
}
