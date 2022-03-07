import { useLocalStorageValue } from "@mantine/hooks";
import Project from "src/models/Project";

const [localProjects, setLocalProjects] = useLocalStorageValue({
  key: "projects",
  defaultValue: "[]",
});

let projects: Project[] = JSON.parse(localProjects);
