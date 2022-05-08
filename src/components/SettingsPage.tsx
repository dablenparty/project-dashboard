import SelectColorItem from "@components/SelectColorItem";
import {
  Select,
  Switch,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { BlendingModeIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";

/**
 * Capitalizes the first letter of a string
 *
 * @param input input string
 * @param locale language locale
 * @returns input string with the first character capitalized
 */
function capitalize(input: string, locale = navigator.language): string {
  //https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
  const [first, ...rest] = input;
  return first.toLocaleUpperCase(locale) + rest.join("");
}

export default function SettingsPage() {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const selectData = Object.keys(theme.colors)
    .filter((color) => color !== "dark")
    .map((color) => ({
      value: color,
      label: capitalize(color),
      color,
    }));

  return (
    <>
      <Switch
        label={`${capitalize(colorScheme as string)} mode`}
        onClick={() => {
          showNotification({
            message: `Switched to ${
              colorScheme === "light" ? "dark" : "light"
            } mode`,
            icon: colorScheme === "light" ? <MoonIcon /> : <SunIcon />,
          });
          toggleColorScheme();
        }}
        checked={colorScheme === "dark"}
        readOnly
      />
      <Select
        mt={"sm"}
        data={selectData}
        label={"Primary color"}
        value={theme.primaryColor}
        nothingFound={"No color found"}
        itemComponent={SelectColorItem}
        placeholder={"Search for a color"}
        onChange={(value) => {
          if (!value) return;
          showNotification({
            message: `Switched color to ${value}`,
            icon: <BlendingModeIcon />,
          });
          theme.other.setPrimaryColor(value);
        }}
      />
    </>
  );
}
