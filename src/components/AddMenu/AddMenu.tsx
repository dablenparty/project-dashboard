import { Menu } from "@mantine/core";
import { ChevronUpIcon, DoubleArrowUpIcon } from "@radix-ui/react-icons";

type AddMenuProps = {
  onAddOneClick?: () => void;
  onAddManyClick?: () => void;
};

export default function AddMenu({
  onAddOneClick,
  onAddManyClick,
}: AddMenuProps) {
  return (
    <Menu placement="end">
      <Menu.Item onClick={onAddOneClick} icon={<ChevronUpIcon />}>
        Add one
      </Menu.Item>
      <Menu.Item onClick={onAddManyClick} icon={<DoubleArrowUpIcon />}>
        Add many
      </Menu.Item>
    </Menu>
  );
}
