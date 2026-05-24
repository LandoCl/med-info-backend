import { supabase } from "../config/supabase";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/token";
import { Usuario, UserSession } from "../types/user.types";
import { v4 as uuidv4 } from "uuid";
import { email } from "zod";

export const registerUser = async (
  userData: Omit<Usuario, "id" | "qr_token" | "created_at" | "updated_at">,
): Promise<UserSession> => {
  const { data: existingUser } = await supabase
    .from("usuarios")
    .select("id")
    .eq("email", userData.email)
    .maybeSingle();

  if (existingUser) {
    throw new Error("El correo electronico ya se encuentra registrado");
  }

  if (userData.curp) {
    const { data: existingCurp } = await supabase
      .from("usuarios")
      .select("id")
      .eq("curp", userData.curp)
      .maybeSingle();
    if (existingCurp) {
      throw new Error("El CURP ingresado ya se encuentra registrado");
    }
  }

  const hashedPassword = await hashPassword(userData.password_hash);
  const qrToken = uuidv4();

  const { data: newUser, error } = await supabase
    .from("usuarios")
    .insert([
      {
        email: userData.email,
        password_hash: hashedPassword,
        nombre: userData.nombre,
        apellido_paterno: userData.apellido_paterno,
        apellido_materno: userData.apellido_materno,
        fecha_nacimiento: userData.fecha_nacimiento,
        sexo: userData.sexo,
        curp: userData.curp,
        telefono: userData.telefono,
        qr_token: qrToken,
      },
    ])
    .select()
    .single();
  if (error || !newUser) {
    throw new Error(
      error?.message || "Error al registrar al usuario en la base de datos",
    );
  }
  const token = generateToken({ id: newUser.id, email: newUser.email });
  const { password_hash, ...cleanUser } = newUser;

  return { user: cleanUser, token };
};

export const loginUser = async (
  email: string,
  passwordPlan: string,
): Promise<UserSession> => {
  const { data: user, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("email", email)
    .maybeSingle();
  if (error || !user) {
    throw new Error("Credenciales incorrectas");
  }
  const token = generateToken({ id: user.id, email: user.email });
  const { password_hash, ...cleanUser } = user;
  return { user: cleanUser, token };
};
