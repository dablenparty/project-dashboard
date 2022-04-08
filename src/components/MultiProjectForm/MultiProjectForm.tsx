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

type BulkProject = {
  name: string;
  description: string;
  rootDir: string;
};

export default function MultiProjectForm() {
  const theme = useMantineTheme();
  const [projects, projectsHandlers] = useListState<BulkProject>();

  const selectDirectories = () => {
    console.log("select directories");
  };

  return (
    <Paper>
      <form>
        <Group direction={"column"} spacing={0}>
          <Text>
            Folders<span style={{ color: "#f03e3e" }}>*</span>
          </Text>
          <Button onClick={selectDirectories}>Select</Button>
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
                <Text>{project.rootDir}</Text>
                <ActionIcon onClick={() => projectsHandlers.remove(index)}>
                  <Cross2Icon />
                </ActionIcon>
              </Group>
              <TextInput defaultValue={project.name} />
              <TextInput mt={"sm"} defaultValue={project.description} />
            </Paper>
          ))}
        </Group>
      </form>
    </Paper>
  );
}
