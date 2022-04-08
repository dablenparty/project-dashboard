import { Button, Group, Paper, Text } from "@mantine/core";

export default function MultiProjectForm() {
  return (
    <Paper>
      <form>
        <Group direction={"column"} spacing={0}>
          <Text>
            Folders<span style={{ color: "#f03e3e" }}>*</span>
          </Text>
          <Button>Select</Button>
        </Group>
      </form>
    </Paper>
  );
}
