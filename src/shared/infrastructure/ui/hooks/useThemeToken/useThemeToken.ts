import { useToken as useChakraToken } from "@chakra-ui/react";

/**
 * Hook to access Chakra UI theme tokens with resolved values.
 * Resolves semantic tokens and returns the actual color/value.
 *
 * @example
 * ```tsx
 * const iconColor = useThemeToken("colors", "icon.primary");
 * const brandColor = useThemeToken("colors", "brand.600");
 *
 * return <LogIn color={iconColor} size={32} />;
 * ```
 */
export function useThemeToken(
  category: "colors" | "fonts" | "sizes" | "spacing",
  path: string
): string {
  const [resolvedValue] = useChakraToken(category, [path]);

  return resolvedValue;
}
