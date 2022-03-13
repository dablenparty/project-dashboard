import { Burger, Group, Header, MediaQuery, Text } from "@mantine/core";

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
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
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
      </div>
    </Header>
  );
}
