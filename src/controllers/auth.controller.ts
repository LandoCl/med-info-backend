import * as authService from "../services/auth.service";
import { sendSuccess } from "../utils/response";
import { Request, Response, NextFunction } from "express";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { password, ...rest } = req.body;

    const session = await authService.registerUser({
      ...rest,
      password_hash: password,
    });
    sendSuccess(res, session, "Registro de paciente completado con exito", 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const session = await authService.loginUser(email, password);
    sendSuccess(res, session, "Inicio de sesion exitoso", 200);
  } catch (error) {
    next(error);
  }
};
