import { supabase } from "../config/supabase";
import { FichaMedicaCompleta } from "../types/medical.types";
import { v4 as uuidv4 } from "uuid";

export const getMedicalSheetByToken = async (
  qrToken: string,
): Promise<FichaMedicaCompleta> => {
  // 1. Obtener usuario
  const { data: usuario, error: userError } = await supabase
    .from("usuarios")
    .select(
      "id, email, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, telefono, foto_url, qr_token",
    )
    .eq("qr_token", qrToken)
    .maybeSingle();

  if (userError || !usuario) {
    throw new Error("Ficha médica no encontrada o código QR no válido");
  }

  // 2. Obtener datos médicos
  const { data: datosMedicos } = await supabase
    .from("datos_medicos")
    .select("*")
    .eq("usuario_id", usuario.id)
    .maybeSingle();

  // 3. Obtener condiciones especiales
  const { data: condicionesEspeciales } = await supabase
    .from("condiciones_especiales")
    .select("*")
    .eq("usuario_id", usuario.id)
    .maybeSingle();

  // 4. Obtener contactos de emergencia
  const { data: contactos } = await supabase
    .from("contactos_emergencia")
    .select("*")
    .eq("usuario_id", usuario.id)
    .order("es_principal", { ascending: false });

  return {
    paciente: usuario,
    datos_medicos: datosMedicos || null,
    condiciones_especiales: condicionesEspeciales || null,
    contactos_emergencia: contactos || [],
  };
};

export const regenerateQRToken = async (userId: string): Promise<string> => {
  const nuevoToken = uuidv4();
  const { data, error } = await supabase
    .from("usuarios")
    .update({ qr_token: nuevoToken })
    .eq("id", userId)
    .select("qr_token")
    .single();

  if (error || !data) {
    throw new Error("No se pudo regenerar el código QR");
  }
  return data.qr_token;
};
