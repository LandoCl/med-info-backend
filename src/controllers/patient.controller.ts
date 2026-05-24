import { Request, Response, NextFunction } from "express";
import * as patientService from "../services/patient.service";
import { sendSuccess } from "../utils/response";

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    sendSuccess(res, req.user, "Perfil obtenido con exito");
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const updatedUser = await patientService.updateProfile(userId, req.body);
    sendSuccess(res, updatedUser, "Datos personales actualizados con éxito");
  } catch (error) {
    next(error);
  }
};
export const getMedicalData = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const data = await patientService.getMedicalData(userId);
    sendSuccess(res, data, "Datos médicos obtenidos con éxito");
  } catch (error) {
    next(error);
  }
};
export const saveMedicalData = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const saved = await patientService.upsertMedicalData(userId, req.body);
    sendSuccess(res, saved, "Datos médicos guardados con éxito");
  } catch (error) {
    next(error);
  }
};
export const getSpecialConditions = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const data = await patientService.getSpecialConditions(userId);
    sendSuccess(res, data, "Condiciones especiales obtenidas con éxito");
  } catch (error) {
    next(error);
  }
};
export const saveSpecialConditions = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const saved = await patientService.upsertSpecialConditions(
      userId,
      req.body,
    );
    sendSuccess(res, saved, "Condiciones especiales guardadas con éxito");
  } catch (error) {
    next(error);
  }
};
export const getContacts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const contacts = await patientService.getEmergencyContacts(userId);
    sendSuccess(res, contacts, "Contactos de emergencia obtenidos");
  } catch (error) {
    next(error);
  }
};
export const createContact = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const contact = await patientService.createEmergencyContact(
      userId,
      req.body,
    );
    sendSuccess(res, contact, "Contacto de emergencia agregado", 201);
  } catch (error) {
    next(error);
  }
};
export const updateContact = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const contactId = req.params.id as string;
    const contact = await patientService.updateEmergencyContact(
      userId,
      contactId,
      req.body,
    );
    sendSuccess(res, contact, "Contacto de emergencia actualizado");
  } catch (error) {
    next(error);
  }
};
export const deleteContact = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const contactId = req.params.id as string;
    await patientService.deleteEmergencyContact(userId, contactId);
    sendSuccess(res, null, "Contacto de emergencia eliminado");
  } catch (error) {
    next(error);
  }
};
