// Importaciones de los módulos necesarios
import User from "./models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "./token.js";
import nodemailer from 'nodemailer';
import 'dotenv/config';

// Configuración del transporte de correo
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
});

// Función para registrar un nuevo usuario
export const register = async (req, res) => {
    const { email, password, username } = req.body;
    try {
        // Verifica si el usuario ya existe
        const userFound = await User.findOne({ email });
        if (userFound) return res.status(400).json(["Este Email ya existe"]);

        // Encripta la contraseña
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: passwordHash
        });
        const userSaved = await newUser.save();
        const token = await createAccessToken({ id: userSaved._id });

        // Envía el correo electrónico de bienvenida
        const mailOptions = {
            from: 'tuemail@gmail.com',
            to: email,
            subject: 'Bienvenido/a a Nuestra Aplicación',
            html: `
            <div style="background-color: #76d7c4 ; padding: 20px; border-radius: 5px;">
            <h2 style="color: #333; font-family: Arial, sans-serif;">Hola ${username}, ¡bienvenido/a a nuestra comunidad!</h2>
            <p style="color: #17202a ; font-family: Arial, sans-serif;">Estamos encantados de tenerte aquí.</p>
            <p style="color: #17202a; font-family: Arial, sans-serif;">¡Disfruta de todas las funcionalidades de nuestra aplicación!</p>
            </div>
            `
        };        

        // Envía el correo electrónico
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email enviado: ' + info.response);
          }
        });

        // Devuelve la información del usuario registrado
        res.cookie("token", token);
        res.json({
            id: userSaved._id,
            username: userSaved.username,
            email: userSaved.email,
            createdAt: userSaved.createdAt,
            updateAt: userSaved.updatedAt
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Función para iniciar sesión de un usuario
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Busca al usuario por su email
        const userFound = await User.findOne({ email });
        if (!userFound) return res.status(400).json({ message: "Usuario no encontrado" });

        // Compara las contraseñas
        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) return res.status(400).json({ message: "Contraseña Incorrecta" });

        // Genera un token de acceso
        const token = await createAccessToken({ id: userFound._id });
        res.cookie("token", token);
        res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            createdAt: userFound.createdAt,
            updateAt: userFound.updatedAt
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Función para cerrar sesión
export const logout = (req, res) => {
    res.cookie("token", "", {
        expires: new Date(0)
    });
    return res.sendStatus(200);
};

// Función para obtener el perfil de un usuario
export const profile = async (req, res) => {
    const userFound = await User.findById(req.user.id);
    if (!userFound) return res.status(400).json({ message: "User no encontrado" });

    return res.json({
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
        createdAt: userFound.createdAt,
        updatedAt: userFound.updateAt
    });
};

// Función para verificar el token de acceso
export const verifyToken = async (req, res) => {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ message: "No autorizado" });

    jwt.verify(token, TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(401).json({ message: "No autorizado" });

        const userFound = await User.findById(user.id);
        if (!userFound) return res.status(401).json({
            message: "No autorizado"
        });
        return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email
        });
    });
};

// Función para crear un token de acceso
function createAccessToken(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            TOKEN_SECRET,
            {
                expiresIn: "2h",
            },
            (err, token) => {
                if (err) reject(err);
                resolve(token);
            }
        );
    });
}
