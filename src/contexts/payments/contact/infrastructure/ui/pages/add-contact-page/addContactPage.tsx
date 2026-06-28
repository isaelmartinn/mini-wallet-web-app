"use client";

import {
  Box,
  Button,
  Card,
  Container,
  Field,
  Heading,
  HStack,
  Input,
  Switch,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { sileo } from "sileo";

import { AddContactUseCase } from "#payments/contact/application/use-cases";
import { ContactRepository } from "#payments/contact/infrastructure/repositories";
import {
  ContactErrorMapper,
  ContactFormErrorMapper,
} from "#payments/contact/infrastructure/ui/error-mapper";
import {
  AddContactFormData,
  addContactSchema,
} from "#payments/contact/infrastructure/ui/schemas/addContact.schema";
import { useFormErrorHandler } from "#shared/infrastructure/ui/hooks";

interface AddContactPageProps {
  contactRepository: ContactRepository;
}

export function AddContactPage({ contactRepository }: AddContactPageProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddContactFormData>({
    defaultValues: {
      email: "",
      isFavorite: false,
      name: "",
      phone: "",
    },
    mode: "onChange",
    resolver: zodResolver(addContactSchema),
  });

  const { handleError } = useFormErrorHandler({
    form,
    formErrorMappers: [new ContactFormErrorMapper()],
    presentationMappers: [new ContactErrorMapper()],
  });

  const onSubmit = async (data: AddContactFormData): Promise<void> => {
    setIsSubmitting(true);
    try {
      const addContactUseCase = new AddContactUseCase(contactRepository);
      const contact = await addContactUseCase.execute({
        email: data.email,
        isFavorite: data.isFavorite,
        name: data.name,
        phone: data.phone,
      });

      sileo.success({
        description: `${contact.getName()} ha sido agregado exitosamente`,
        title: "Contacto agregado",
      });

      router.push(`/transactions/new?contactId=${contact.getId()}`);
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = (): void => {
    router.back();
  };

  return (
    <Box bg="gray.50" minH="calc(100vh - 57px)" py={8}>
      <Container maxW="600px" mx="auto" px={{ base: 4, md: 6 }}>
        <VStack align="stretch" gap={6} width="full">
          <HStack>
            <Button
              colorScheme="gray"
              data-testid="back-button"
              onClick={handleBack}
              size="sm"
              variant="ghost"
            >
              <ArrowLeft size={20} />
            </Button>
            <Heading size="lg">Agregar Contacto</Heading>
          </HStack>

          <Card.Root>
            <Card.Body p={6}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <VStack align="stretch" gap={4}>
                  <Field.Root invalid={!!form.formState.errors.name}>
                    <Field.Label>Nombre</Field.Label>
                    <Input
                      {...form.register("name")}
                      data-testid="contact-name-input"
                      disabled={isSubmitting}
                      placeholder="Nombre completo"
                    />
                    {form.formState.errors.name && (
                      <Field.ErrorText>
                        {form.formState.errors.name.message}
                      </Field.ErrorText>
                    )}
                  </Field.Root>

                  <Field.Root invalid={!!form.formState.errors.email}>
                    <Field.Label>Email</Field.Label>
                    <Input
                      {...form.register("email")}
                      data-testid="contact-email-input"
                      disabled={isSubmitting}
                      placeholder="correo@ejemplo.com"
                      type="email"
                    />
                    {form.formState.errors.email && (
                      <Field.ErrorText>
                        {form.formState.errors.email.message}
                      </Field.ErrorText>
                    )}
                  </Field.Root>

                  <Field.Root invalid={!!form.formState.errors.phone}>
                    <Field.Label>Teléfono</Field.Label>
                    <Input
                      {...form.register("phone")}
                      data-testid="contact-phone-input"
                      disabled={isSubmitting}
                      placeholder="+52 55 1234 5678"
                    />
                    {form.formState.errors.phone && (
                      <Field.ErrorText>
                        {form.formState.errors.phone.message}
                      </Field.ErrorText>
                    )}
                  </Field.Root>

                  <Field.Root>
                    <HStack justify="space-between">
                      <Field.Label mb={0}>Marcar como favorito</Field.Label>
                      <Controller
                        control={form.control}
                        name="isFavorite"
                        render={({ field: { onChange, value, ...field } }) => (
                          <Switch.Root
                            {...field}
                            checked={value}
                            data-testid="contact-favorite-switch"
                            disabled={isSubmitting}
                            onCheckedChange={(details) =>
                              onChange(details.checked)
                            }
                          >
                            <Switch.HiddenInput />
                            <Switch.Control>
                              <Switch.Thumb />
                            </Switch.Control>
                          </Switch.Root>
                        )}
                      />
                    </HStack>
                  </Field.Root>

                  <Button
                    colorScheme="blue"
                    data-testid="save-contact-button"
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    mt={2}
                    size="lg"
                    type="submit"
                    width="full"
                  >
                    Guardar Contacto
                  </Button>
                </VStack>
              </form>
            </Card.Body>
          </Card.Root>
        </VStack>
      </Container>
    </Box>
  );
}
