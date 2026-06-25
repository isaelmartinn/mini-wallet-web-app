import { z } from "zod";

export const loginSchema = z.object({
  credential: z
    .string()
    .min(1, "Este campo es requerido")
    .refine(
      (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        const cleanedValue = value.replace(/[\s\-()]/g, "");
        return emailRegex.test(value) || phoneRegex.test(cleanedValue);
      },
      {
        message: "Ingresa un email o teléfono válido",
      }
    ),
});

export type LoginFormData = z.infer<typeof loginSchema>;
