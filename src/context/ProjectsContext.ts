import { useLocalStorageValue } from "@mantine/hooks";
import Project from "src/models/Project";

const [localProjects, setLocalProjects] = useLocalStorageValue({
  key: "projects",
  defaultValue: "[]" as string,
});

let projects: Project[] = JSON.parse(localProjects);

/**
 * Adds a project to the list of projects
 *
 * @param project Project to add to the list of projects
 */
function addProject(project: Project) {
  projects.push(project);
  setLocalProjects(JSON.stringify(projects));
}

/**
 * Delete a project from the list of projects
 * @param projectId ID of project to remove from the list of projects
 */
function deleteProject(projectId: string) {
  projects = projects.filter((p) => p.id !== projectId);
  setLocalProjects(JSON.stringify(projects));
}

/**
 * Updates a project in the list of projects with the ID matching that of the given project
 * @param project Updated project to replace the existing project
 */
function editProject(project: Project) {
  const projectIndex = projects.findIndex((p) => p.id === project.id);
  projects[projectIndex] = project;
  setLocalProjects(JSON.stringify(projects));
}
