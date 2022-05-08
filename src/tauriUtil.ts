import { Command } from "@tauri-apps/api/shell";

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
