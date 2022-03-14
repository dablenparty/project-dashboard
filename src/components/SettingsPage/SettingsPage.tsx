import { Switch, useMantineColorScheme } from "@mantine/core";

function capitalize(input: string, locale = navigator.language): string {
  //https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
  const [first, ...rest] = input;
  return first.toLocaleUpperCase(locale) + rest.join("");
}

export default function SettingsPage() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  // TODO: add color picker for primary color

  return (
    <Switch
      label={`${capitalize(colorScheme as string)} mode`}
      onClick={() => toggleColorScheme()}
      checked={colorScheme === "dark"}
      readOnly
    />
  );
}
