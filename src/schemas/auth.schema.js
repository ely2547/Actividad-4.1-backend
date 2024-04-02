// Importamos la biblioteca `zod` para la validación de datos
import { z } from "zod";

// **Validación del Registro**

// Definimos un esquema para la validación del registro de un usuario
export const registerSchema = z.object({
  // Validación del nombre de usuario
  username: z.string().nonempty({
    // Mensaje de error si el nombre de usuario está vacío
    message: "Nombre de Usuario es Requerido"
  }),
  // Validación del email
  email: z.string().nonempty({
    // Mensaje de error si el email está vacío
    message: "Email es requerido"
  }).email("Email Invalido"), // Validación del formato del email
  // Validación de la contraseña
  password: z.string().min(3, {
    // Mensaje de error si la contraseña es menor a 3 caracteres
    message: "Contraseña debe contener mínimo 3 caracteres"
  })
});

// **Validación del Login**

// Definimos un esquema para la validación del login de un usuario
export const loginSchema = z.object({
  // Validación del email
  email: z.string().nonempty({
    // Mensaje de error si el email está vacío
    message: "Email es requerido"
  }).email("Email invalido"), // Validación del formato del email
  // Validación de la contraseña
  password: z.string().min(3, {
    // Mensaje de error si la contraseña es menor a 3 caracteres
    message: "Contraseña debe contener mínimo 3 caracteres"
  })
});
