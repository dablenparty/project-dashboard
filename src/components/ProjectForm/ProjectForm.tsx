import { Button, Group, Paper, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import {
  ArchiveIcon,
  GitHubLogoIcon,
  LetterCaseCapitalizeIcon,
  QuestionMarkIcon,
} from "@radix-ui/react-icons";
import { useProjects } from "src/context/ProjectsContext";

export default function ProjectForm() {
  const projectsContext = useProjects();

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      rootDir: "",
      url: "",
    },
    validationRules: {
      name: (value) =>
        projectsContext?.projects.find((p) => p.name === value.trim()) ===
        undefined,
    },
    errorMessages: {
      name: "Project with this name already exists",
    },
  });

  return (
    <Paper shadow={"sm"} padding={"sm"} m={"sm"}>
      <form>
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
        <Group mt={"sm"} position="right">
          <Button>Submit</Button>
        </Group>
      </form>
    </Paper>
  );
}
