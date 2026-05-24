import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env";
import { apiLimiter } from "./config/rateLimit";
import { errorHandler } from "./middleware/errorHandler";
import { authMiddleware } from "./middleware/auth.middleware";
import { sendSuccess } from "./utils/response";

import authRoutes from './routes/auth.routes';
import patientRoutes from './routes/patient.routes';
import qrRoutes from './routes/qr.routes';

const app = express();
const PORT = env.PORT;

// Middlewares globales de seguridad e infraestructura
app.use(helmet());
app.use(
  cors({
    origin: "*", // Se puede restringir en producción
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

// Aplicar rate limiter general a toda la API
app.use("/api", apiLimiter);

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/qr', qrRoutes);

// Ruta raíz para evitar 404 en chequeos de salud de Render
app.get('/', (req, res) => {
  res.status(200).send('API de QR Médico activa. Visite /api/health para verificar el estado.');
});

// Endpoint de prueba (Health check)
app.get("/api/health", (req, res) => {
  sendSuccess(
    res,
    {
      status: "UP",
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    },
    "Servidor de QR Médico funcionando correctamente",
  );
});

// Endpoint de prueba de autenticación
app.get("/api/test-auth", authMiddleware, (req, res) => {
  sendSuccess(
    res,
    {
      message: "Has accedido a una ruta protegida con éxito",
      user: req.user,
    },
    "Autenticación exitosa",
  );
});

// Middleware de manejo de errores global (Debe ir al final de las rutas)
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(
    `Servidor ejecutándose en modo [${env.NODE_ENV}] sobre el puerto ${PORT}`,
  );
  console.log(`URL base del API: http://localhost:${PORT}/api`);
});
