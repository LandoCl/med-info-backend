import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  message: string;
  error: any | null;
}

/**
 * Envia una respuesta exitosa estandarizada
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Operación realizada con éxito',
  statusCode = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    error: null,
  };
  return res.status(statusCode).json(response);
};

/**
 * Envia una respuesta de error estandarizada
 */
export const sendError = (
  res: Response,
  error: any,
  message = 'Ha ocurrido un error en el servidor',
  statusCode = 400
): Response => {
  const response: ApiResponse = {
    success: false,
    data: null,
    message,
    error: typeof error === 'string' ? { message: error } : error,
  };
  return res.status(statusCode).json(response);
};
