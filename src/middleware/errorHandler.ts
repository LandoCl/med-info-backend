import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";
import { env } from "../config/env";

/**
 * Middleware centralizado de control de errores
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error("Error capturado en errorHandler:", err);

  // Manejo de errores específicos de JWT
  if (err.name === "JsonWebTokenError") {
    sendError(
      res,
      { code: "INVALID_TOKEN", details: err.message },
      "El token de autenticación provisto no es válido",
      401,
    );
    return;
  }
  if (err.name === "TokenExpiredError") {
    sendError(
      res,
      { code: "EXPIRED_TOKEN", details: err.message },
      "El token de autenticación ha expirado",
      401,
    );
    return;
  }

  // Errores de Base de datos / Supabase conocidos (ej. violación de foreign key, etc.)
  if (err.code && err.message && typeof err.code === "string") {
    sendError(
      res,
      { code: `DATABASE_ERROR_${err.code}`, details: err.message },
      "Ocurrió un problema en la persistencia de datos",
      400,
    );
    return;
  }

  // Error por defecto o de estado personalizado
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Ocurrió un error inesperado en el servidor";
  const errorDetails =
    env.NODE_ENV === "development" ? { stack: err.stack, original: err } : null;

  sendError(res, errorDetails, message, status);
};
