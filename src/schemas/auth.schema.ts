import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Email no valido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellido_paterno: z.string().min(1, "El apellido paterno es obligatorio"),
  apellido_materno: z.string().optional().nullable(),
  fecha_nacimiento: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Fecha de nacimiento invalida",
  }),
  sexo: z.enum(["masculino", "femenino", "otro"]),
  curp: z
    .string()
    .min(18, "La CURP debe tener exactamente 18 caracteres")
    .optional().nullable(),
  telefono: z
    .string()
    .min(10, "El telefono debe tener al menos 10 digitos")
    .max(15),
});

export const loginSchema = z.object({
  email: z.string().email("Email no valido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});
