import { ActionIcon, MantineStyleSystemProps, Menu } from "@mantine/core";
import {
  ChevronUpIcon,
  DoubleArrowUpIcon,
  PlusIcon,
} from "@radix-ui/react-icons";

type AddMenuProps = MantineStyleSystemProps & {
  onAddOneClick?: () => void;
  onAddManyClick?: () => void;
};

export default function AddMenu({
  onAddOneClick,
  onAddManyClick,
  ...others
}: AddMenuProps) {
  return (
    <Menu
      control={
        <ActionIcon>
          <PlusIcon />
        </ActionIcon>
      }
      placement={"end"}
      transition={"scale-y"}
      {...others}
    >
      <Menu.Item onClick={onAddOneClick} icon={<ChevronUpIcon />}>
        Add one
      </Menu.Item>
      <Menu.Item onClick={onAddManyClick} icon={<DoubleArrowUpIcon />}>
        Add many
      </Menu.Item>
    </Menu>
  );
}
