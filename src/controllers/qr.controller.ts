import { Request, Response, NextFunction } from "express";
import * as qrService from "../services/qr.service";
import { sendSuccess } from "../utils/response";

export const getSheet = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { token } = req.params;
    const sheet = await qrService.getMedicalSheetByToken(token as string);
    sendSuccess(res, sheet, "Ficha medica recuperada con exito");
  } catch (error) {
    next(error);
  }
};

export const regenerateQR = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const nuevoToken = await qrService.regenerateQRToken(userId);
    sendSuccess(
      res,
      { qr_token: nuevoToken },
      "Codigo QR regenerado con exito",
    );
  } catch (error) {
    next(error);
  }
};
