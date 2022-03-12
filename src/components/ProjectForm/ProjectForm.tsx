import { Button, Group, Paper, TextInput } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import {
  ArchiveIcon,
  GitHubLogoIcon,
  LetterCaseCapitalizeIcon,
  QuestionMarkIcon,
} from "@radix-ui/react-icons";
import { useProjects } from "@context/ProjectsContext";
import Project from "@models/Project";

interface ProjectFormProps {
  onSubmit: (values: ProjectFormState) => void;
  buttonText?: string;
  project?: Project;
}

interface ProjectFormState {
  name: string;
  description: string;
  rootDir: string;
  url: string;
}

export default function ProjectForm({
  onSubmit,
  buttonText,
  project,
}: ProjectFormProps) {
  const { projects } = useProjects();

  const form = useForm<ProjectFormState>({
    initialValues: project ?? {
      name: `Project ${projects.length ?? 0}`,
      description: "",
      rootDir: "",
      url: "",
    },
    validationRules: {
      name: (value) =>
        projects.find((p) => p.name === value.trim()) === undefined,
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
        <TextInput
          mt={"sm"}
          label={"Root folder"}
          icon={<ArchiveIcon />}
          required
          placeholder={"Where is your project stored?"}
          {...form.getInputProps("rootDir")}
        />
        <TextInput
          type={"url"}
          mt={"sm"}
          label={"URL"}
          icon={<GitHubLogoIcon />}
          placeholder={"Is this project on GitHub?"}
          {...form.getInputProps("url")}
        />
        <Group mt={"lg"} position={"right"}>
          <Button type={"submit"}>{buttonText || "Submit"}</Button>
        </Group>
      </form>
    </Paper>
  );
}
