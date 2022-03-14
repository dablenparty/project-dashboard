import { Burger, Button, Group, Header, MediaQuery, Text } from "@mantine/core";
import { GearIcon } from "@radix-ui/react-icons";

type AppShellHeaderProps = {
  title: string;
  burgerOpened: boolean;
  onBurgerClick: () => void;
};

export default function AppShellHeader({
  title,
  burgerOpened,
  onBurgerClick,
}: AppShellHeaderProps) {
  return (
    <Header height={70} padding={"md"}>
      <Group
        position={"apart"}
        style={{ display: "flex", alignItems: "center", height: "100%" }}
      >
        <Group>
          <MediaQuery largerThan={"sm"} styles={{ display: "none" }}>
            <Burger
              opened={burgerOpened}
              onClick={onBurgerClick}
              size={"sm"}
              mr={"xl"}
            />
          </MediaQuery>
          <Text>{title}</Text>
        </Group>
        <Button leftIcon={<GearIcon />}>Settings</Button>
      </Group>
    </Header>
  );
}
