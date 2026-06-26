import { z } from "zod";

export const addContactSchema = z.object({
  email: z.string().min(1, "El email es requerido").email("Email inválido"),
  isFavorite: z.boolean(),
  name: z.string().min(1, "El nombre es requerido"),
  phone: z.string().min(1, "El teléfono es requerido"),
});

export type AddContactFormData = z.infer<typeof addContactSchema>;
