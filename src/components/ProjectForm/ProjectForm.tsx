import { Button, Group, Paper, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import {
  ArchiveIcon,
  GitHubLogoIcon,
  LetterCaseCapitalizeIcon,
  QuestionMarkIcon,
} from "@radix-ui/react-icons";
import { useProjects } from "@context/ProjectsContext";
import Project from "@models/Project";
import { ipcRenderer } from "electron";

type ProjectFormProps = {
  onSubmit: (values: ProjectFormState) => void;
  project?: Project;
};

type ProjectFormState = {
  name: string;
  description: string;
  rootDir: string;
  url: string;
};

export default function ProjectForm({ onSubmit, project }: ProjectFormProps) {
  const { projects } = useProjects();

  const form = useForm<ProjectFormState>({
    initialValues: project ?? {
      name: `Project ${projects.length ?? 0}`,
      description: "",
      rootDir: "",
      url: "",
    },
    validationRules: {
      url: (value) => {
        if (value.trim() === "") {
          return true;
        }
        // https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
        let url;

        try {
          url = new URL(value);
        } catch (_) {
          return false;
        }

        return url.protocol === "https:" && url.hostname === "github.com";
      },
    },
    errorMessages: {
      name: "Project with this name already exists",
      url: "Invalid GitHub URL",
    },
  });

  function handleSubmit(values: ProjectFormState) {
    onSubmit(values);
    form.reset();
  }

  async function selectDirectory() {
    const file = await ipcRenderer.invoke("openFileDialog");
    if (file) {
      form.setFieldValue("rootDir", file);
    }
    const url: string = await ipcRenderer.invoke("getRemoteGitUrl", file);
    if (url) {
      // pull the ".git" off the end of the url
      form.setFieldValue("url", url.slice(0, url.length - 4));
    }
  }

  return (
    <Paper>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label={"Project Name"}
          icon={<LetterCaseCapitalizeIcon />}
          placeholder={"What's your project called?"}
          required
          {...form.getInputProps("name")}
        />
        <TextInput
          mt={"sm"}
          label={"Description"}
          icon={<QuestionMarkIcon />}
          placeholder={"What's this project about?"}
          required
          {...form.getInputProps("description")}
        />
        {form.values.rootDir ? (
          <TextInput
            readOnly
            required
            mt={"sm"}
            label={"Root folder"}
            icon={<ArchiveIcon />}
            onClick={selectDirectory}
            {...form.getInputProps("rootDir")}
          />
        ) : (
          <Group direction={"column"} spacing={0} mt={"sm"}>
            <Text size={"sm"} weight={500}>
              Root folder<span style={{ color: "#f03e3e" }}>*</span>
            </Text>
            <Button variant={"subtle"} onClick={selectDirectory}>
              Select
            </Button>
          </Group>
        )}
        <TextInput
          type={"url"}
          mt={"sm"}
          label={"URL"}
          icon={<GitHubLogoIcon />}
          placeholder={"Where is this project on GitHub?"}
          {...form.getInputProps("url")}
        />
        <Group mt={"lg"} position={"right"}>
          <Button type={"submit"}>{project ? "Save" : "Add"}</Button>
        </Group>
      </form>
    </Paper>
  );
}
