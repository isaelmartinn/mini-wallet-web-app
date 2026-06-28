import { useToken as useChakraToken } from "@chakra-ui/react";

export function useThemeToken(
  category: "colors" | "fonts" | "sizes" | "spacing",
  path: string
): string {
  const [resolvedValue] = useChakraToken(category, [path]);

  return resolvedValue;
}
