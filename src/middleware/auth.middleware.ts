import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/token';
import { sendError } from '../utils/response';

/**
 * Middleware para proteger rutas que requieren autenticación del paciente
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(
      res,
      { code: 'UNAUTHORIZED', details: 'No se encontró la cabecera Authorization con formato Bearer' },
      'Acceso denegado. Se requiere iniciar sesión.',
      401
    );
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    // Asignar el payload (id y email) al request.
    // Esto funciona porque importamos y extendemos el namespace global de Express.Request en types/request.types.ts
    req.user = decoded;
    next();
  } catch (error) {
    // Redirigir al middleware de control de errores (errorHandler)
    // para tratar errores específicos de expiración o firma de JWT
    next(error);
  }
};
