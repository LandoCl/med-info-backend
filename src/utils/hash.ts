import bcrypt from 'bcryptjs';

/**
 * Encripta una contraseña en texto plano utilizando bcryptjs
 * @param password Contraseña en texto plano
 * @returns Hash de la contraseña
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compara una contraseña en texto plano con su hash encriptado
 * @param password Contraseña en texto plano
 * @param hash Hash encriptado guardado en la base de datos
 * @returns Boolean que indica si coinciden o no
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
