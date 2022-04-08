import SettingsPage from "@components/SettingsPage";
import { Burger, Button, Group, Header, MediaQuery, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
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
  const modals = useModals();

  const openSettingsModal = () => {
    const modalId = modals.openModal({
      title: "Settings",
      children: (
        <>
          <SettingsPage />
          <Button
            mt={"lg"}
            sx={{ float: "right" }}
            onClick={() => modals.closeModal(modalId)}
          >
            Close
          </Button>
        </>
      ),
    });
  };

  return (
    <Header height={70} p={"md"}>
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
        <Button onClick={openSettingsModal} leftIcon={<GearIcon />}>
          Settings
        </Button>
      </Group>
    </Header>
  );
}
