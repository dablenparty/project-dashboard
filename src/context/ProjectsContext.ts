import { useLocalStorageValue } from "@mantine/hooks";
import { createContext, useContext, useMemo, useState } from "react";
import Project from "src/models/Project";

const ProjectsContext = createContext<ProjectsContextInterface | undefined>(undefined);

interface ProjectsContextInterface {
  projects: Project[];
  addProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  editProject: (project: Project) => void;
}

export function useProjects() {
  return useContext(ProjectsContext);
}

interface ProjectsProviderProps {
  children: React.ReactNode;
}

export const ProjectsProvider = ({ children }: ProjectsProviderProps) => {
  const [localProjects, setLocalProjects] = useLocalStorageValue({
    key: "projects",
    defaultValue: "[]" as string,
  });

  const [projects, setProjects] = useState<Project[]>(
    JSON.parse(localProjects)
  );

  /**
   * Adds a project to the list of projects
   *
   * @param project Project to add to the list of projects
   */
  function addProject(project: Project) {
    setProjects([...projects, project]);
    setLocalProjects(JSON.stringify(projects));
  }

  /**
   * Delete a project from the list of projects
   * @param projectId ID of project to remove from the list of projects
   */
  function deleteProject(projectId: string) {
    const filtered = projects.filter((p) => p.id !== projectId);
    setProjects(filtered);
    setLocalProjects(JSON.stringify(projects));
  }

  /**
   * Updates a project in the list of projects with the ID matching that of the given project
   * @param project Updated project to replace the existing project
   */
  function editProject(project: Project) {
    const projectIndex = projects.findIndex((p) => p.id === project.id);
    const edited = [...projects];
    edited[projectIndex] = project;
    setProjects(edited);
    setLocalProjects(JSON.stringify(projects));
  }

  const value = useMemo(() => {
    return {
      projects,
      addProject,
      deleteProject,
      editProject,
    };
  }, [projects]);

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
}
