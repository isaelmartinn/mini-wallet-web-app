"use client";

import { Box, Button, HStack } from "@chakra-ui/react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "#auth/infrastructure/store";
import { UserHeaderCompact } from "#shared/infrastructure/ui/components";
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
  const { isLoading, userProfile } = useWalletStore();
  const iconColor = useThemeToken("colors", "icon.primary");

  const handleLogout = () => {
    clearSession();
    clearWallet();
    router.push("/login");
  };

  return (
    <Box bg="gray.50" minH="100vh">
      <Box as="nav" bg="white" borderBottomWidth="1px" py={3}>
        <Box maxW="600px" mx="auto" px={{ base: 4, md: 6 }}>
          <HStack justify="space-between">
            <UserHeaderCompact
              fullName={userProfile?.getFullName()}
              initials={userProfile?.getInitials()}
              isLoading={isLoading}
            />
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
        </Box>
      </Box>
      <Box as="main">{children}</Box>
    </Box>
  );
}
