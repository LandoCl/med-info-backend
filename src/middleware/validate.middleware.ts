import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";
import { sendError } from "../utils/response";

interface ValidationSchemas {
  body?: ZodObject;
  query?: ZodObject;
  params?: ZodObject;
}

/**
 * Middleware para validar datos de entrada de peticiones Express con Zod
 * @param schemas Objeto que contiene opcionalmente esquemas para body, query y params
 */
export const validateRequest = (schemas: ValidationSchemas) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      if (schemas.query) {
        req.query = (await schemas.query.parseAsync(req.query)) as any;
      }
      if (schemas.params) {
        req.params = (await schemas.params.parseAsync(req.params)) as any;
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        sendError(
          res,
          { code: "VALIDATION_ERROR", details: issues },
          "La solicitud contiene parámetros incorrectos o faltantes",
          400,
        );
        return;
      }
      next(error);
    }
  };
};
