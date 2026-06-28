"use client";

import {
  Box,
  Button,
  Card,
  HStack,
  IconButton,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Eye, EyeOff, Send } from "lucide-react";
import { useMemo, useState } from "react";

import { IntlCurrencyFormatter } from "#shared/infrastructure";
import { useThemeToken } from "#shared/infrastructure/ui/hooks";
import { Balance } from "#wallet/domain/entities";

interface BalanceCardProps {
  balance: Balance | null;
  isLoading?: boolean;
  onSendMoney?: () => void;
}

export function BalanceCard({
  balance,
  isLoading = false,
  onSendMoney,
}: BalanceCardProps) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const iconColor = useThemeToken("colors", "icon.primary");
  const currencyFormatter = useMemo(() => new IntlCurrencyFormatter(), []);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible((prev) => !prev);
  };

  if (isLoading || !balance) {
    return (
      <Card.Root bg="brand.50" data-loading="true" p={6}>
        <Card.Body>
          <Skeleton height="20px" mb={2} width="150px" />
          <Skeleton height="40px" width="200px" />
        </Card.Body>
      </Card.Root>
    );
  }

  const formattedBalance = balance
    .getAmount()
    .format(currencyFormatter, balance.getCurrency());

  return (
    <Card.Root bg="brand.50" p={6}>
      <Card.Body>
        <VStack align="stretch" gap={4}>
          <Box>
            <Text color="gray.600" fontSize="sm" fontWeight="medium" mb={2}>
              Saldo disponible
            </Text>
            <HStack justify="space-between">
              <Box>
                {isBalanceVisible ? (
                  <Text
                    color="gray.900"
                    data-testid="balance-amount"
                    fontSize="3xl"
                    fontWeight="bold"
                  >
                    {formattedBalance}
                  </Text>
                ) : (
                  <Text
                    color="gray.900"
                    data-testid="balance-hidden"
                    fontSize="3xl"
                    fontWeight="bold"
                  >
                    ••••••
                  </Text>
                )}
              </Box>
              <IconButton
                aria-label={
                  isBalanceVisible ? "Ocultar saldo" : "Mostrar saldo"
                }
                data-testid={
                  isBalanceVisible
                    ? "hide-balance-button"
                    : "show-balance-button"
                }
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
          </Box>

          {onSendMoney && (
            <Button
              colorScheme="blue"
              data-testid="new-transaction-button"
              onClick={onSendMoney}
              size="lg"
              width="full"
            >
              <Send size={20} />
              Enviar dinero
            </Button>
          )}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
