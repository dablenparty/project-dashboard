import {
  AppShell,
  Text,
  Navbar,
  Header,
  MediaQuery,
  Burger,
} from "@mantine/core";
import "./App.css";
import { useState } from "react";

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
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <MediaQuery largerThan={"sm"} styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size={"sm"}
                mr={"xl"}
              />
            </MediaQuery>
            <Text>Application header</Text>
          </div>
        </Header>
      }
    >
      <Text>GOD HELP ME PLEASE</Text>
    </AppShell>
  );
}

export default App;
