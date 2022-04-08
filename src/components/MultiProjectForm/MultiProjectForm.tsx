import {
  ActionIcon,
  Button,
  Group,
  Paper,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { Cross2Icon } from "@radix-ui/react-icons";
import { ipcRenderer } from "electron";
import path from "path";

type BulkProject = {
  name: string;
  description: string;
  rootDir: string;
};

export default function MultiProjectForm() {
  const theme = useMantineTheme();
  const [projects, projectsHandlers] = useListState<BulkProject>();

  const selectDirectories = async () => {
    const files: string[] | null = await ipcRenderer.invoke("openFileDialog", {
      multiple: true,
    });
    if (!files) {
      return;
    }
    const newProjects = files.map((file) => ({
      name: path.basename(file),
      description: "",
      rootDir: file,
    }));
    projectsHandlers.setState(newProjects);
  };

  return (
    <Paper>
      <form>
        <Group direction={"row"}>
          <Text>
            Folders<span style={{ color: "#f03e3e" }}>*</span>
          </Text>
          <Button variant={"light"} onClick={selectDirectories}>
            Select
          </Button>
        </Group>
        <Group mt={"md"} direction={"column"}>
          {projects.map((project, index) => (
            <Paper
              p={"sm"}
              sx={{ width: "100%", backgroundColor: theme.colors.dark[6] }}
              key={project.rootDir}
              shadow={"md"}
              withBorder
            >
              <Group mb={"sm"} position="apart">
                <Text
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    flex: 1,
                  }}
                >
                  {project.rootDir}
                </Text>
                <ActionIcon onClick={() => projectsHandlers.remove(index)}>
                  <Cross2Icon />
                </ActionIcon>
              </Group>
              <TextInput
                required
                label={"Name"}
                placeholder={"Name"}
                defaultValue={project.name}
              />
              <TextInput
                required
                label={"Description"}
                placeholder={"Description"}
                mt={"sm"}
                defaultValue={project.name}
              />
            </Paper>
          ))}
        </Group>
        <Group mt={"lg"} position={"right"}>
          <Button type={"submit"}>Submit</Button>
        </Group>
      </form>
    </Paper>
  );
}
