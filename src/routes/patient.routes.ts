import { Router } from "express";
import {
  getProfile,
  updateProfile,
  getMedicalData,
  saveMedicalData,
  getSpecialConditions,
  saveSpecialConditions,
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} from "../controllers/patient.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validate.middleware";
import { updateProfileSchema } from "../schemas/patient.schema";
import {
  medicalDataSchema,
  specialConditionsSchema,
  emergencyContactSchema,
} from "../schemas/medical.schema";
const router = Router();

router.use(authMiddleware);

router.get("/profile", getProfile);
router.put(
  "/profile",
  validateRequest({ body: updateProfileSchema }),
  updateProfile,
);
router.get("/medical", getMedicalData);
router.put(
  "/medical",
  validateRequest({ body: medicalDataSchema }),
  saveMedicalData,
);
router.get("/conditions", getSpecialConditions);
router.put(
  "/conditions",
  validateRequest({ body: specialConditionsSchema }),
  saveSpecialConditions,
);
router.get("/contacts", getContacts);
router.post(
  "/contacts",
  validateRequest({ body: emergencyContactSchema }),
  createContact,
);
router.put(
  "/contacts/:id",
  validateRequest({ body: emergencyContactSchema }),
  updateContact,
);
router.delete("/contacts/:id", deleteContact);

export default router;
