import { z } from "zod";

export const medicalDataSchema = z.object({
  tipo_sangre: z.enum([
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
    "desconocido",
  ]),
  peso_kg: z.number().positive().nullable().optional(),
  altura_cm: z.number().positive().nullable().optional(),
  alergias: z.array(z.string()).default([]),
  medicamentos_actuales: z.array(z.string()).default([]),
  enfermedades_cronicas: z.array(z.string()).default([]),
  cirugias_previas: z.array(z.string()).default([]),
  donador_organos: z.boolean().default(false),
  seguro_medico: z.string().optional().nullable(),
  numero_poliza: z.string().optional().nullable(),
});

export const specialConditionsSchema = z.object({
  discapacidades: z.array(z.string()).default([]),
  implantes: z.array(z.string()).default([]),
  protesis: z.array(z.string()).default([]),
  restricciones_medicamento: z.array(z.string()).default([]),
  notas_adicionales: z.string().optional().nullable(),
});

export const emergencyContactSchema = z.object({
  nombre: z.string().min(1, "El nombre del contacto es obligatorio"),
  relacion: z.string().min(1, "La relación es obligatoria"),
  telefono: z
    .string()
    .min(10, "El teléfono debe tener al menos 10 dígitos")
    .max(15),
  telefono_alt: z.string().optional().nullable(),
  es_principal: z.boolean().default(false),
});
