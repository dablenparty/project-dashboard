import {
  AppShell,
  Text,
  Navbar,
  Header,
  MediaQuery,
  Burger,
  Group,
  ActionIcon,
  ScrollArea,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import "./App.css";
import { useState } from "react";
import { MixIcon, PlusIcon } from "@radix-ui/react-icons";

function App() {
  const [opened, setOpened] = useState(false);
  const [projectIndex, setProjectIndex] = useState(0);
  const theme = useMantineTheme();
  return (
    <AppShell
      navbarOffsetBreakpoint={"sm"}
      fixed
      navbar={
        <Navbar
          padding={"sm"}
          hiddenBreakpoint={"sm"}
          hidden={!opened}
          width={{ sm: 300, lg: 400 }}
        >
          <Navbar.Section grow component={ScrollArea}>
            {Array(10)
              .fill("Navbar element")
              .map((element, index) => (
                <UnstyledButton
                  key={index}
                  sx={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 4,
                    ":hover": { backgroundColor: theme.colors.gray[1] },
                  }}
                  onClick={() => setProjectIndex(index)}
                >
                  <Text>
                    {element} {index}
                  </Text>
                </UnstyledButton>
              ))}
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={70} padding={"md"}>
          <Group
            position="apart"
            sx={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <Group>
              <MediaQuery largerThan={"sm"} styles={{ display: "none" }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size={"sm"}
                  mr={"xl"}
                />
              </MediaQuery>
              <Text>Application header</Text>
            </Group>
            <ActionIcon>
              <PlusIcon />
            </ActionIcon>
          </Group>
        </Header>
      }
    >
      <Text>Selected index: {projectIndex}</Text>
    </AppShell>
  );
}

export default App;
