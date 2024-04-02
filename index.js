// Importación de módulos necesarios
import express, { Router } from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { login, register, logout, profile, verifyToken } from "./src/auth.js";
import { authRequired, validateSchema } from "./src/middlewares.js";
import { registerSchema, loginSchema } from "./src/schemas/auth.schema.js";


// Conexión a la base de datos MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://anggemarigi:Pancho20.@cluster2.vhsetpj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2', {
      serverSelectionTimeoutMS: 500000,
      socketTimeoutMS: 4500000,
    });
    console.log("Base de datos conectada exitosamente");
  } catch (error) {
    console.log(error);
  }
};

// Iniciar conexión a la base de datos
connectDB();

// Creación de la aplicación Express
const app = express();
const router = Router();

// Configuración de middlewares
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Verificar y crear la carpeta 'uploads' si no existe
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Servir archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static('uploads'));

// Configuración de Multer para el almacenamiento de imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Definición del esquema de Mongoose para los productos
const productoSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  reviews: [{
    user: String,
    comment: String,
    rating: Number,
    date: { type: Date, default: Date.now }
  }],
  price: Number,
  quantity: Number,
  availability: Boolean
});

const Producto = mongoose.model('Producto', productoSchema);

// Definición de rutas CRUD
router.post("/register", validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);
router.post("/logout", logout);
router.get("/verify", verifyToken);

// Endpoint para agregar un producto con imagen
app.post('/productos', upload.single('image'), (req, res) => {
  const newProducto = new Producto({
    name: req.body.name,
    description: req.body.description,
    image: req.file.path,
    reviews: [],
    price: req.body.price,
    quantity: req.body.quantity,
    availability: req.body.availability
  });
  newProducto.save().then(() => res.json('Producto agregado exitosamente!'));
});

// Endpoint para obtener todos los productos
app.get('/productos', (req, res) => {
  Producto.find()
    .then(productos => res.json(productos))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Endpoint para agregar una reseña a un producto
app.post('/productos/:id/review', (req, res) => {
  Producto.findById(req.params.id)
    .then(producto => {
      producto.reviews.push({
        user: req.body.user,
        comment: req.body.comment,
        rating: req.body.rating
      });
      producto.save()
        .then(() => res.json('Reseña agregada exitosamente.'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// Endpoint para obtener las reseñas de un producto
app.get('/productos/:id/reviews', (req, res) => {
  Producto.findById(req.params.id)
    .then(producto => {
      res.json(producto.reviews);
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// Endpoint para actualizar un producto
app.put('/productos/:id', upload.single('image'), (req, res) => {
  Producto.findById(req.params.id)
    .then(producto => {
      producto.name = req.body.name;
      producto.description = req.body.description;
      if (req.file) {
        producto.image = req.file.path;
      }
      producto.price = req.body.price;
      producto.quantity = req.body.quantity;
      producto.availability = req.body.availability;
      producto.save()
        .then(() => res.json('Producto actualizado exitosamente.'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// Endpoint para eliminar un producto
app.delete('/productos/:id', (req, res) => {
  Producto.findByIdAndDelete(req.params.id)
    .then(() => res.json('Producto eliminado.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

app.use("/api", router);

// Configuración del puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
