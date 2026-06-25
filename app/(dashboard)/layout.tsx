"use client";

import { Box, Button, Container, HStack } from "@chakra-ui/react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "#auth/infrastructure/store";
import { useThemeToken } from "#shared/infrastructure/ui/hooks";
import { useWalletStore } from "#wallet/infrastructure/store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const clearSession = useAuthStore((state) => state.clearSession);
  const clearWallet = useWalletStore((state) => state.clearWallet);
  const iconColor = useThemeToken("colors", "icon.primary");

  const handleLogout = () => {
    clearSession();
    clearWallet();
    router.push("/login");
  };

  return (
    <Box bg="gray.50" minH="100vh">
      <Box as="nav" bg="white" borderBottomWidth="1px" px={4} py={3}>
        <Container maxW="container.xl">
          <HStack justify="flex-end">
            <Button
              data-testid="logout-button"
              onClick={handleLogout}
              size="sm"
              variant="ghost"
            >
              <LogOut color={iconColor} size={20} />
              Cerrar sesión
            </Button>
          </HStack>
        </Container>
      </Box>
      <Box as="main" py={4}>
        {children}
      </Box>
    </Box>
  );
}
