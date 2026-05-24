import { supabase } from "../config/supabase";
import {
  DatosMedicos,
  CondicionesEspeciales,
  ContactoEmergencia,
} from "../types/medical.types";
import { UsuarioClean } from "../types/user.types";

export const updateProfile = async (
  userId: string,
  profileData: Partial<UsuarioClean>,
): Promise<UsuarioClean> => {
  const { data, error } = await supabase
    .from("usuarios")
    .update(profileData)
    .eq("id", userId)
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Error al actualizar el perfil");
  }

  const { password_hash, ...cleanUser } = data as any;
  return cleanUser;
};

export const getMedicalData = async (
  userId: string,
): Promise<DatosMedicos | null> => {
  const { data, error } = await supabase
    .from("datos_medicos")
    .select("*")
    .eq("usuario_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
};

export const upsertMedicalData = async (
  userId: string,
  medicalData: Omit<DatosMedicos, "id" | "usuario_id" | "updated_at">,
): Promise<DatosMedicos> => {
  const { data, error } = await supabase
    .from("datos_medicos")
    .upsert(
      {
        usuario_id: userId,
        ...medicalData,
      },
      { onConflict: "usuario_id" },
    )
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Error al guardar los datos médicos");
  }
  return data;
};

export const getSpecialConditions = async (
  userId: string,
): Promise<CondicionesEspeciales | null> => {
  const { data, error } = await supabase
    .from("condiciones_especiales")
    .select("*")
    .eq("usuario_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
};

export const upsertSpecialConditions = async (
  userId: string,
  conditionsData: Omit<
    CondicionesEspeciales,
    "id" | "usuario_id" | "updated_at"
  >,
): Promise<CondicionesEspeciales> => {
  const { data, error } = await supabase
    .from("condiciones_especiales")
    .upsert(
      {
        usuario_id: userId,
        ...conditionsData,
      },
      { onConflict: "usuario_id" },
    )
    .select()
    .single();

  if (error || !data) {
    throw new Error(
      error?.message || "Error al guardar las condiciones especiales",
    );
  }
  return data;
};

export const getEmergencyContacts = async (
  userId: string,
): Promise<ContactoEmergencia[]> => {
  const { data, error } = await supabase
    .from("contactos_emergencia")
    .select("*")
    .eq("usuario_id", userId)
    .order("es_principal", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
};

export const createEmergencyContact = async (
  userId: string,
  contactData: Omit<ContactoEmergencia, "id" | "usuario_id" | "created_at">,
): Promise<ContactoEmergencia> => {
  // Si se marca como principal, desactivar anteriores
  if (contactData.es_principal) {
    await supabase
      .from("contactos_emergencia")
      .update({ es_principal: false })
      .eq("usuario_id", userId);
  }

  const { data, error } = await supabase
    .from("contactos_emergencia")
    .insert([
      {
        usuario_id: userId,
        ...contactData,
      },
    ])
    .select()
    .single();

  if (error || !data) {
    throw new Error(
      error?.message || "Error al crear el contacto de emergencia",
    );
  }
  return data;
};

export const updateEmergencyContact = async (
  userId: string,
  contactId: string,
  contactData: Partial<ContactoEmergencia>,
): Promise<ContactoEmergencia> => {
  if (contactData.es_principal) {
    await supabase
      .from("contactos_emergencia")
      .update({ es_principal: false })
      .eq("usuario_id", userId);
  }

  const { data, error } = await supabase
    .from("contactos_emergencia")
    .update(contactData)
    .eq("id", contactId)
    .eq("usuario_id", userId) // Seguridad extra
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Error al actualizar el contacto");
  }
  return data;
};

export const deleteEmergencyContact = async (
  userId: string,
  contactId: string,
): Promise<void> => {
  const { error } = await supabase
    .from("contactos_emergencia")
    .delete()
    .eq("id", contactId)
    .eq("usuario_id", userId);

  if (error) throw new Error(error.message);
};
