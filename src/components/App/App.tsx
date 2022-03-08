import { Card, Center } from "@mantine/core";
import ProjectForm from "src/components/ProjectForm";
import { useProjects } from "src/context/ProjectsContext";
import Project from "src/models/Project";
import "./App.css";
import { v4 as uuidv4 } from "uuid";

function App() {
  const projectsContext = useProjects();
  return (
    <>
      <Center>
        <h1>Hello, with Mantine!</h1>
      </Center>
      <ProjectForm
        title="Add Project"
        buttonText="Add"
        onSubmit={(values) => {
          const project: Project = {
            id: uuidv4(),
            ...values,
          };
          projectsContext?.addProject(project);
        }}
      />
      {projectsContext?.projects.map((project) => (
        <Card>
          <h2>{project.name}</h2>
          <p>{project.description}</p>
        </Card>
      ))}
    </>
  );
}

export default App;
