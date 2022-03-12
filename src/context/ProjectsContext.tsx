import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Project from "@models/Project";
import { ipcRenderer } from "electron";

const ProjectsContext = createContext<ProjectsContextInterface | undefined>(
  undefined
);

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
  const [projects, setProjects] = useState<Project[]>([]);
  const shouldSave = useRef(false);

  // load the projects when the component is loaded
  useEffect(() => {
    ipcRenderer.invoke("loadProjects").then((projects: Project[]) => {
      console.log("loaded projects", projects);
      // prevent it from saving data that was just loaded
      shouldSave.current = false;
      setProjects(projects);
    });
  }, []);

  // save the projects whenever they're updated
  useEffect(() => {
    if (!shouldSave.current) {
      shouldSave.current = true;
      return;
    }
    ipcRenderer.invoke("saveProjects", projects).then(() => {
      console.log("projects saved");
    });
  }, [projects]);

  /**
   * Adds a project to the list of projects
   *
   * @param project Project to add to the list of projects
   */
  function addProject(project: Project) {
    const newProjects = [...projects, project];
    setProjects(newProjects);
  }

  /**
   * Delete a project from the list of projects
   * @param projectId ID of project to remove from the list of projects
   */
  function deleteProject(projectId: string) {
    const filtered = projects.filter((p) => p.id !== projectId);
    setProjects(filtered);
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
  }

  const value = useMemo(() => {
    return {
      projects,
      addProject,
      deleteProject,
      editProject,
    };
  }, [projects]);

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};
