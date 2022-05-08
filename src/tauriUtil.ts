import Project from "@models/Project";
import { fs, path } from "@tauri-apps/api";
import { Command } from "@tauri-apps/api/shell";

async function getDataDir() {
  return await path.join(await path.dataDir(), "Project Dashboard");
}

/**
 * Gets the remote git repository URL for a given folder.
 *
 * @param folder The folder to search in
 * @returns Remote Git URL if it exists, otherwise empty string
 */
export async function getRemoteGitUrl(folder: string): Promise<string> {
  const command = new Command("git", ["remote", "get-url", "origin"], {
    cwd: folder,
  });
  const result = await command.execute();
  return result.stdout.trim();
}

/**
 * Reads and parses the projects.json file in this applications data directory.
 *
 * @returns parsed projects array
 */
export async function loadProjects(): Promise<Project[]> {
  const userData = await getDataDir();
  const projects = await path.join(userData, "projects.json");
  const projectsData = await fs.readTextFile(projects);
  return JSON.parse(projectsData);
}

/**
 * Saves the projects array to the projects.json file in this applications data directory.
 *
 * @param projects The projects to save
 */
export async function saveProjects(projects: Project[]) {
  const userData = await getDataDir();
  const filePath = await path.join(userData, "projects.json");
  const projectsData = JSON.stringify(projects);
  await fs.writeFile({ contents: projectsData, path: filePath });
}
