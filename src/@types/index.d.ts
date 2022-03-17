import "@mantine/core"

declare module "@mantine/core" {
  export interface MantineThemeOther {
    setPrimaryColor(color: string): void;
  }
}
