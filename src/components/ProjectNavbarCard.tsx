import { UnstyledButton, Text, useMantineTheme } from "@mantine/core";
import Project from "@models/Project";

type ProjectNavbarCardProps = {
  project: Project;
  onCardClick: (project: Project) => void;
};

export default function ProjectNavbarCard({
  project,
  onCardClick,
}: ProjectNavbarCardProps) {
  const theme = useMantineTheme();

  return (
    <UnstyledButton
      sx={{
        width: "100%",
        padding: 10,
        borderRadius: 4,
        ":hover": {
          backgroundColor:
            theme.colorScheme === "light"
              ? theme.colors.gray[0]
              : theme.colors.dark[8],
          color: theme.colors[theme.primaryColor][6],
        },
      }}
      onClick={() => onCardClick(project)}
    >
      <Text>{project.name}</Text>
      {/* https://stackoverflow.com/questions/3922739/limit-text-length-to-n-lines-using-css */}
      <Text
        sx={{
          textOverflow: "ellipsis",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 1,
          lineClamp: 1,
          WebkitBoxOrient: "vertical",
        }}
        size={"sm"}
        color={"dimmed"}
      >
        {project.description}
      </Text>
    </UnstyledButton>
  );
}
