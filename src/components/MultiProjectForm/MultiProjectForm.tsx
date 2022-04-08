import {
  ActionIcon,
  Button,
  Group,
  Paper,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useForm, useListState } from "@mantine/hooks";
import { Cross2Icon } from "@radix-ui/react-icons";
import { ipcRenderer } from "electron";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { useProjects } from "@context/ProjectsContext";
import Project from "@models/Project";
import { useEffect } from "react";

type BulkProject = {
  name: string;
  description: string;
  rootDir: string;
};

type MultiProjectFormState = {
  projects: BulkProject[];
};

type MultiProjectFormProps = {
  onSubmit?: (values: MultiProjectFormState) => void;
};

export default function MultiProjectForm({ onSubmit }: MultiProjectFormProps) {
  const theme = useMantineTheme();
  const [projects, projectsHandlers] = useListState<BulkProject>();
  const { addManyProjects } = useProjects();
  const form = useForm<MultiProjectFormState>({
    initialValues: {
      projects: [],
    },
    validationRules: {
      projects: (values) =>
        values.length > 0 && values.every((p) => p.description.trim() !== ""),
    },
  });

  useEffect(() => {
    form.setValues({ projects: projects });
  }, [projects, form]);

  const selectDirectories = async () => {
    const files: string[] | null = await ipcRenderer.invoke("openFileDialog", {
      multiple: true,
    });
    if (!files) {
      return;
    }
    const newProjects = files.map((file) => {
      const basename = path.basename(file);
      return {
        name: basename,
        description: basename,
        rootDir: file,
      };
    });
    projectsHandlers.setState(newProjects);
    form.setValues({ projects: newProjects });
  };

  const handleSubmit = async (values: MultiProjectFormState) => {
    const newProjects: Project[] = await Promise.all(
      values.projects.map(async (project) => ({
        id: uuidv4(),
        url: await ipcRenderer.invoke("getRemoteGitUrl", project.rootDir),
        ...project,
      }))
    );
    addManyProjects(newProjects);
    onSubmit?.(values);
    form.reset();
  };

  return (
    <Paper>
      <form onSubmit={form.onSubmit(handleSubmit)}>
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
                onChange={(e) =>
                  projectsHandlers.setItemProp(index, "name", e.target.value)
                }
              />
              <TextInput
                required
                label={"Description"}
                placeholder={"Description"}
                mt={"sm"}
                defaultValue={project.description}
                onChange={(e) =>
                  projectsHandlers.setItemProp(
                    index,
                    "description",
                    e.target.value
                  )
                }
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
