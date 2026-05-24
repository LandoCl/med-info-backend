import { z } from "zod";

export const updateProfileSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellido_paterno: z.string().min(1, "El apellido paterno es obligatorio"),
  apellido_materno: z.string().optional().nullable(),
  fecha_nacimiento: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Fecha no válida",
  }),
  sexo: z.enum(["masculino", "femenino", "otro"]),
  curp: z
    .string()
    .length(18, "El CURP debe tener 18 caracteres")
    .optional()
    .nullable(),
  telefono: z.string().min(10).max(15),
  foto_url: z.string().url().optional().nullable(),
});
