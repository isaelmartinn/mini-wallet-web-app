import {
  Box,
  Container,
  Heading,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

import { ConfirmationLoadingStateProps } from "./confirmationLoadingState.interface";

export function ConfirmationLoadingState({
  message = "Por favor espera mientras confirmamos tu transferencia...",
}: ConfirmationLoadingStateProps) {
  return (
    <Box bg="gray.50" minH="calc(100vh - 57px)" py={8}>
      <Container maxW="600px" mx="auto" px={{ base: 4, md: 6 }}>
        <VStack align="stretch" gap={8} width="full">
          <Box display="flex" justifyContent="center" width="full">
            <motion.div
              animate={{ rotate: 360 }}
              style={{ display: "inline-block" }}
              transition={{ duration: 1, ease: "linear", repeat: Infinity }}
            >
              <Spinner color="blue.500" size="xl" />
            </motion.div>
          </Box>
          <VStack gap={2}>
            <Heading size="lg">Procesando transferencia</Heading>
            <Text color="gray.600" textAlign="center">
              {message}
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}
