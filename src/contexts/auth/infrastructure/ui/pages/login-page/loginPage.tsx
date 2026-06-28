"use client";

import {
  Box,
  Button,
  Card,
  Field,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { sileo } from "sileo";

import { LoginUseCase } from "#auth/application";
import { AuthRepository, mockUsers, useAuthStore } from "#auth/infrastructure";
import {
  AuthErrorMapper,
  AuthFormErrorMapper,
} from "#auth/infrastructure/ui/error-mapper";
import { LoginFormData, loginSchema } from "#auth/infrastructure/ui/schemas";
import {
  useFormErrorHandler,
  useThemeToken,
} from "#shared/infrastructure/ui/hooks";

export function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const setUser = useAuthStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(false);
  const iconColor = useThemeToken("colors", "icon.primary");

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/home");
    }
  }, [authLoading, isAuthenticated, router]);

  const exampleEmail = mockUsers[2]?.getEmail()?.getValue();
  const examplePhone = mockUsers[0]?.getPhone()?.getValue();

  const form = useForm<LoginFormData>({
    defaultValues: {
      credential: "",
    },
    mode: "onChange",
    resolver: zodResolver(loginSchema),
  });

  const { handleError } = useFormErrorHandler({
    form,
    formErrorMappers: [new AuthFormErrorMapper()],
    presentationMappers: [new AuthErrorMapper()],
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const authRepository = new AuthRepository();
      const loginUseCase = new LoginUseCase(authRepository);

      const user = await loginUseCase.execute({
        credential: data.credential,
      });

      setUser(user);

      sileo.success({
        description: `Bienvenido, ${user.getName()}`,
        title: "Inicio de sesión exitoso",
      });

      router.push("/home");
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      alignItems="center"
      bg="gray.50"
      display="flex"
      justifyContent="center"
      minH="100vh"
      p={4}
    >
      <Card.Root maxW="md" shadow="lg" w="full">
        <Card.Header pb={6} pt={10}>
          <VStack gap={6}>
            <Box
              alignItems="center"
              bg="blue.100"
              borderRadius="full"
              display="flex"
              h={16}
              justifyContent="center"
              w={16}
            >
              <LogIn color={iconColor} size={32} />
            </Box>

            <VStack gap={2}>
              <Heading size="xl" textAlign="center">
                Iniciar sesión
              </Heading>

              <Text color="gray.600" fontSize="md" textAlign="center">
                Ingresa tu email o teléfono para continuar
              </Text>
            </VStack>
          </VStack>
        </Card.Header>

        <Card.Body pb={10} pt={0} px={6}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <VStack gap={8}>
              <Field.Root invalid={!!form.formState.errors.credential}>
                <Field.Label fontSize="md" fontWeight="medium">
                  Email o Teléfono
                </Field.Label>

                <Input
                  {...form.register("credential")}
                  data-testid="credential-input"
                  disabled={isLoading}
                  h={12}
                  placeholder="ejemplo@email.com o +521234567890"
                  px={4}
                  size="lg"
                  type="text"
                />

                {form.formState.errors.credential && (
                  <Field.ErrorText>
                    {form.formState.errors.credential.message}
                  </Field.ErrorText>
                )}
              </Field.Root>

              <VStack gap={6} pt={4} w="full">
                <Button
                  colorScheme="blue"
                  data-testid="login-button"
                  disabled={isLoading}
                  h={12}
                  loading={isLoading}
                  size="lg"
                  type="submit"
                  w="full"
                >
                  {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                </Button>

                <Text color="gray.500" fontSize="sm" textAlign="center">
                  Usuarios de prueba: {exampleEmail}, {examplePhone}
                </Text>
              </VStack>
            </VStack>
          </form>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}
