import useLimitedArray from "@hooks/useLimitedArray";
import {
  ActionIcon,
  Anchor,
  Group,
  LoadingOverlay,
  Text,
  useMantineTheme,
} from "@mantine/core";
import Project from "@models/Project";
import { GitHubLogoIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

type ProjectPageProps = {
  project: Project;
};

type ReadmeCacheEntry = {
  projectId: string;
  rawText: string;
};

/**
 * Creates a Project Page component.
 *
 * ## Important
 * `project` should be a state variable created by the `useState` hook
 *
 * @param project The project to display
 * @returns ProjectPage component
 */
export default function ProjectPage({ project }: ProjectPageProps) {
  const theme = useMantineTheme();
  const [readmeRaw, setReadmeRaw] = useState("Loading...");
  const [readmeLoading, setReadmeLoading] = useState(false);
  const { array: readmeCache, addItem: addReadmeCacheEntry } =
    useLimitedArray<ReadmeCacheEntry>([], 5);

  useEffect(() => {
    // if the selected projects README text is stored in the cache, just use that
    const entry = readmeCache.find((e) => e.projectId == project.id);
    if (entry) {
      setReadmeRaw(entry.rawText);
      return;
    }
    // otherwise, fetch the README text from the folder
    setReadmeLoading(true);
    ipcRenderer.invoke("getReadme", project.rootDir).then((readme) => {
      const readmeText = readme ?? "No README.md found";
      addReadmeCacheEntry({
        projectId: project.id,
        rawText: readmeText,
      });
      setReadmeRaw(readmeText);
      setReadmeLoading(false);
    });
  }, [project]);

  return (
    <>
      <Group position={"apart"}>
        <Text weight={"bold"} size={"xl"}>
          {project.name}
        </Text>
        <Group>
          {project.url && (
            <ActionIcon
              sx={{
                "&:hover": {
                  color: theme.colors[theme.primaryColor][6],
                },
              }}
              variant={"transparent"}
              onClick={async () =>
                await ipcRenderer.invoke("openExternal", project.url)
              }
            >
              <GitHubLogoIcon />
            </ActionIcon>
          )}
          <ActionIcon
            sx={{
              "&:hover": {
                color: theme.colors[theme.primaryColor][6],
              },
            }}
            variant={"transparent"}
          >
            <Pencil1Icon />
          </ActionIcon>
        </Group>
      </Group>
      <Anchor
        onClick={async () =>
          await ipcRenderer.invoke("openPath", project.rootDir)
        }
        size={"sm"}
        color={"dimmed"}
      >
        {project.rootDir}
      </Anchor>
      <Text mt={"md"} size={"sm"} color={"dimmed"}>
        Description
      </Text>
      <Text>{project.description}</Text>
      <div
        style={{
          position: "relative",
          height: readmeLoading ? "100%" : "auto",
        }}
      >
        <LoadingOverlay visible={readmeLoading} />
        <ReactMarkdown
          components={{ a: (props) => <a target={"_blank"} {...props} /> }}
        >
          {readmeRaw}
        </ReactMarkdown>
      </div>
    </>
  );
}
