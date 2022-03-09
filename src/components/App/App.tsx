import {
  AppShell,
  Text,
  Navbar,
  Header,
  MediaQuery,
  Burger,
  Group,
  ActionIcon,
} from "@mantine/core";
import "./App.css";
import { useState } from "react";
import { PlusIcon } from "@radix-ui/react-icons";

function App() {
  const [opened, setOpened] = useState(false);
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
          <Text>Navbar</Text>
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
      <Text>GOD HELP ME PLEASE</Text>
    </AppShell>
  );
}

export default App;
