"use client";

import {
  Box,
  Card,
  HStack,
  IconButton,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { useThemeToken } from "#shared/infrastructure/ui/hooks";
import { Balance } from "#wallet/domain/entities";

interface BalanceCardProps {
  balance: Balance | null;
  isLoading?: boolean;
}

export function BalanceCard({ balance, isLoading = false }: BalanceCardProps) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const iconColor = useThemeToken("colors", "icon.primary");

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible((prev) => !prev);
  };

  const formatCurrency = (amount: number, currency: string): string => {
    return new Intl.NumberFormat("es-MX", {
      currency,
      style: "currency",
    }).format(amount);
  };

  if (isLoading || !balance) {
    return (
      <Card.Root bg="brand.50" p={6}>
        <Card.Body>
          <Skeleton height="20px" mb={2} width="150px" />
          <Skeleton height="40px" width="200px" />
        </Card.Body>
      </Card.Root>
    );
  }

  const formattedBalance = formatCurrency(
    balance.getAmount().getValue(),
    balance.getCurrency()
  );

  return (
    <Card.Root bg="brand.50" p={6}>
      <Card.Body>
        <Text color="gray.600" fontSize="sm" fontWeight="medium" mb={2}>
          Saldo disponible
        </Text>
        <HStack justify="space-between">
          <Box>
            {isBalanceVisible ? (
              <Text color="gray.900" fontSize="3xl" fontWeight="bold">
                {formattedBalance}
              </Text>
            ) : (
              <Text color="gray.900" fontSize="3xl" fontWeight="bold">
                ••••••
              </Text>
            )}
          </Box>
          <IconButton
            aria-label={isBalanceVisible ? "Ocultar saldo" : "Mostrar saldo"}
            onClick={toggleBalanceVisibility}
            size="sm"
            variant="ghost"
          >
            {isBalanceVisible ? (
              <EyeOff color={iconColor} size={20} />
            ) : (
              <Eye color={iconColor} size={20} />
            )}
          </IconButton>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
}
