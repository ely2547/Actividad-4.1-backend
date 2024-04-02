// Importa la libreria jsonwebtoken para trabajar con tokens JWT
import jwt from "jsonwebtoken";

// Importa la clave secreta para la verificacion de tokens
import { TOKEN_SECRET } from "./token.js";

// Funcion middleware para validar la autenticacion de usuario
export const authRequired = (req, res, next) => {
 // Obtiene el token desde las cookies de la request
 const { token } = req.cookies;

 // Si no hay un token presente:
 if (!token) {
   // Devuelve un error 401 (no autorizado)
   return res.status(401).json({ message: "No token, autorizacion denegada" });
 }

 // Intenta verificar el token usando la clave secreta
 jwt.verify(token, TOKEN_SECRET, (err, user) => {
   // Si hay un error en la verificacion:
   if (err) {
     // Devuelve un error 403 (token invalido)
     return res.status(403).json({ message: "token invalido" });
   }

   // Si la verificacion es exitosa:
   console.log(user); // Imprime los datos del usuario autenticado en la consola
   // Agrega el usuario a la request para su uso en rutas posteriores
   req.user = user;
   // Continua a la siguiente funcion middleware o ruta
   next();
 });
};

// Funcion middleware para validar un esquema de datos en la request
export const validateSchema = (schema) => (req, res, next) => {
 try {
   // Intenta validar el cuerpo de la request segun el esquema
   schema.parse(req.body);
   // Si la validacion es exitosa, continua a la siguiente funcion middleware o ruta
   next();
 } catch (error) {
   // Si hay un error de validacion, devuelve un error 400 con los mensajes de error
   return res.status(400).json(error.errors.map((error) => error.message));
 }
};

