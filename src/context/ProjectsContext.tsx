import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Project from "@models/Project";
import { flushSync } from "react-dom";
import { showNotification, updateNotification } from "@mantine/notifications";
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";
import { loadProjects, saveProjects } from "../tauriUtil";

const ProjectsContext = createContext<ProjectsContextProps | undefined>(
  undefined
);

interface ProjectsContextProps {
  projects: Project[];
  addProject: (project: Project) => void;
  addManyProjects: (newProjects: Project[]) => void;
  deleteProject: (projectId: string) => void;
  editProject: (project: Project) => void;
}

export function useProjects(): ProjectsContextProps {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
}

interface ProjectsProviderProps {
  children: React.ReactNode;
}

export const ProjectsProvider = ({ children }: ProjectsProviderProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const shouldSave = useRef(false);

  // load the projects when the component is loaded
  useEffect(() => {
    let isMounted = true;
    showNotification({
      id: "projects-loading",
      title: "Loading projects",
      message: "Sit tight while we load your projects",
      autoClose: false,
      disallowClose: true,
      loading: true,
    });
    loadProjects()
      .then((projects: Project[]) => {
        if (isMounted) {
          // forces the component to re-render before changing the ref's value
          // by opting this state change out of React's batching mechanism
          flushSync(() => {
            setProjects(projects);
          });
          updateNotification({
            id: "projects-loading",
            title: "Projects loaded!",
            message: `${projects.length} projects were found`,
            autoClose: 2000,
            color: "teal",
            icon: <CheckIcon />,
            loading: false,
          });
          // enable saving the projects to disk
          shouldSave.current = true;
        }
      })
      .catch((e) => {
        console.error(e);
        updateNotification({
          id: "projects-loading",
          title: "Uh oh!",
          message: "Something went wrong while loading your projects",
          color: "red",
          icon: <Cross1Icon />,
          autoClose: 3000,
          loading: false,
        });
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Mantine has a built-in hook for this pattern, but in order to prevent
  // saving data that was just loaded, it has to be done manually. Otherwise,
  // two refs are needed.
  // save the projects whenever they're updated
  useEffect(() => {
    if (!shouldSave.current) {
      return;
    }
    showNotification({
      id: "projects-saving",
      title: "Saving projects",
      message: "Sit tight while we save your projects",
      autoClose: false,
      disallowClose: true,
      loading: true,
    });
    saveProjects(projects)
      .then(() => {
        updateNotification({
          id: "projects-saving",
          title: "Projects saved!",
          message: `${projects.length} projects were successfully saved`,
          autoClose: 2000,
          color: "teal",
          icon: <CheckIcon />,
          loading: false,
        });
      })
      .catch((e) => {
        console.error(e);
        updateNotification({
          id: "projects-saving",
          title: "Uh oh!",
          message: "Something went wrong while saving your projects",
          color: "red",
          icon: <Cross1Icon />,
          autoClose: 3000,
          loading: false,
        });
      });
  }, [projects]);

  /**
   * Adds a project to the list of projects
   *
   * @param project Project to add to the list of projects
   */
  const addProject = useCallback(
    (project: Project) => {
      setProjects((projects) =>
        [...projects, project].sort((a, b) => a.name.localeCompare(b.name))
      );
    },
    [setProjects]
  );

  /**
   * Adds a list of new projects to the list of existing projects
   *
   * @param newProjects Projects to add to the list of projects
   */
  const addManyProjects = useCallback(
    (newProjects: Project[]) => {
      setProjects((projects) =>
        [...projects, ...newProjects].sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      );
    },
    [setProjects]
  );

  /**
   * Delete a project from the list of projects
   * @param projectId ID of project to remove from the list of projects
   */
  const deleteProject = useCallback(
    (projectId: string) => {
      const filtered = projects.filter((p) => p.id !== projectId);
      setProjects(filtered);
    },
    [projects]
  );

  /**
   * Updates a project in the list of projects with the ID matching that of the given project
   * @param project Updated project to replace the existing project
   */
  const editProject = useCallback(
    (project: Project) => {
      const projectIndex = projects.findIndex((p) => p.id === project.id);
      const edited = [...projects];
      edited[projectIndex] = project;
      setProjects(edited);
    },
    [projects]
  );

  const value = useMemo(() => {
    return {
      projects,
      addProject,
      addManyProjects,
      deleteProject,
      editProject,
    };
  }, [projects, addProject, addManyProjects, deleteProject, editProject]);

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};
