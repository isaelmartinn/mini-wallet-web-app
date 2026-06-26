import { Box, Grid, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowDownLeft, ArrowUpRight, Clock, XCircle } from "lucide-react";
import { useMemo } from "react";

import { IntlCurrencyFormatter } from "#shared/infrastructure";
import { useThemeToken } from "#shared/infrastructure/ui/hooks";
import { Transaction } from "#transactions/domain";

interface MovementItemProps {
  transaction: Transaction;
}

export function MovementItem({ transaction }: MovementItemProps) {
  const iconPrimaryColor = useThemeToken("colors", "icon.primary");
  const successColor = useThemeToken("colors", "green.500");
  const errorColor = useThemeToken("colors", "red.500");
  const warningColor = useThemeToken("colors", "orange.500");
  const currencyFormatter = useMemo(() => new IntlCurrencyFormatter(), []);

  const isIncome = transaction.getType().isIncome();
  const isExpense = transaction.getType().isExpense();
  const isPending = transaction.getStatus().isPending();
  const isFailed = transaction.getStatus().isFailed();

  const amount = transaction.getAmount();
  const formattedAmount = currencyFormatter.format(amount, "MXN");

  const displayAmount = isExpense
    ? `-${formattedAmount}`
    : `+${formattedAmount}`;
  const amountColor = isExpense ? "red.600" : "green.600";

  const date = transaction.getDate().getValue();
  const formattedDate = format(date, "d 'de' MMMM, yyyy", { locale: es });
  const formattedTime = format(date, "HH:mm", { locale: es });

  const getStatusIcon = () => {
    if (isPending) {
      return <Clock color={warningColor} size={12} />;
    }
    if (isFailed) {
      return <XCircle color={errorColor} size={12} />;
    }
    return null;
  };

  const getStatusText = () => {
    if (isPending) return "Pendiente";
    if (isFailed) return "Fallida";
    return null;
  };

  const statusText = getStatusText();

  return (
    <Box
      _hover={{ bg: "gray.50" }}
      borderBottom="1px"
      borderColor="gray.200"
      cursor="pointer"
      p={{ base: 3, md: 4 }}
      transition="background-color 0.2s"
      width="full"
    >
      <Grid
        alignItems="center"
        gap={{ base: 2, md: 3 }}
        gridTemplateColumns="1fr 150px"
        width="full"
      >
        <HStack gap={{ base: 2, md: 3 }} minW={0}>
          <Box
            alignItems="center"
            bg={isIncome ? "green.50" : "red.50"}
            borderRadius="full"
            display="flex"
            flexShrink={0}
            h={{ base: 8, md: 10 }}
            justifyContent="center"
            w={{ base: 8, md: 10 }}
          >
            {isIncome ? (
              <Icon as={ArrowDownLeft} color={successColor} />
            ) : (
              <Icon as={ArrowUpRight} color={iconPrimaryColor} />
            )}
          </Box>

          <VStack align="start" gap={1} minW={0}>
            <Text
              color="gray.900"
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="medium"
            >
              {transaction.getDescription()}
            </Text>
            <HStack gap={2}>
              <HStack gap={1}>
                <Text color="gray.600" fontSize={{ base: "xs", md: "sm" }}>
                  {formattedDate}
                </Text>
                <Text color="gray.400" fontSize={{ base: "xs", md: "sm" }}>
                  •
                </Text>
                <Text color="gray.600" fontSize={{ base: "xs", md: "sm" }}>
                  {formattedTime}
                </Text>
              </HStack>
              {statusText && (
                <HStack
                  alignItems="center"
                  bg={isPending ? "orange.50" : "red.50"}
                  borderRadius="full"
                  flexShrink={0}
                  gap={1}
                  px={2}
                  py={0.5}
                >
                  {getStatusIcon()}
                  <Text
                    color={isPending ? "orange.700" : "red.700"}
                    fontSize="xs"
                    fontWeight="medium"
                  >
                    {statusText}
                  </Text>
                </HStack>
              )}
            </HStack>
          </VStack>
        </HStack>

        <Text
          color={amountColor}
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="bold"
          textAlign="right"
        >
          {displayAmount}
        </Text>
      </Grid>
    </Box>
  );
}
