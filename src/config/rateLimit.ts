import rateLimit from 'express-rate-limit';

// Limitador general para toda la API
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // Máximo 200 peticiones por ventana por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    message: 'Demasiadas solicitudes desde esta dirección IP, por favor intente de nuevo en 15 minutos.',
    error: {
      code: 'TOO_MANY_REQUESTS',
      details: 'Límite de peticiones de la API excedido.'
    }
  }
});

// Limitador estricto para rutas de autenticación
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 15, // Máximo 15 intentos (login/registro) por ventana por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    message: 'Demasiados intentos de autenticación o registro. Intente de nuevo en 15 minutos.',
    error: {
      code: 'TOO_MANY_AUTH_REQUESTS',
      details: 'Límite de intentos de autenticación excedido.'
    }
  }
});
