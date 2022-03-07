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

  return (
    <Paper shadow={"sm"} padding={"sm"} m={"sm"}>
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
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
          <Button type={"submit"}>Submit</Button>
        </Group>
      </form>
    </Paper>
  );
}
