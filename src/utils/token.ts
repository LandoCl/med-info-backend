import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface TokenPayload {
  id: string;
  email: string;
}

/**
 * Genera un token JWT firmado con validez de 7 días
 * @param payload Contenido a codificar en el token (id y email del usuario)
 * @returns Token JWT en formato string
 */
export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

/**
 * Verifica y decodifica un token JWT
 * @param token Token JWT a verificar
 * @returns Payload decodificado si es válido
 * @throws Error si el token es inválido o expiró
 */
export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
};
