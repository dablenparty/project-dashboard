import { ColorSwatch, Group, Text, useMantineTheme } from "@mantine/core";
import { forwardRef } from "react";

interface SelectColorItemProps {
  color: string;
  label: string;
}

const SelectColorItem = forwardRef<HTMLDivElement, SelectColorItemProps>(
  ({ color, label, ...others }, ref) => {
    const theme = useMantineTheme();
    return (
      <div ref={ref} {...others}>
        <Group noWrap>
          <ColorSwatch key={color} color={theme.colors[color][6]} />
          <Text size={"sm"}>{label}</Text>
        </Group>
      </div>
    );
  }
);

export default SelectColorItem;
