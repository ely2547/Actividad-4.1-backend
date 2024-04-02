## README

### Descripción
El código backend es una aplicación Node.js que utiliza Express, MongoDB, y otras tecnologías para gestionar usuarios, productos, autenticación, y más. Permite el registro de usuarios, inicio de sesión, gestión de perfiles, y operaciones CRUD para productos.

### Estructura de Archivos
- **index.js**: Archivo principal que configura el servidor, las rutas, la conexión a la base de datos, y los middlewares.
- **middlewares.js**: Contiene funciones de middleware para la autenticación y validación de esquemas.
- **auth.js**: Implementa las funciones para el registro, inicio de sesión, cierre de sesión, y perfil de usuario.
- **auth.schema.js**: Define los esquemas de validación para el registro y login de usuarios.
- **user.model.js**: Define el modelo de datos de usuario utilizando Mongoose.

### Funcionalidades Principales
1. Registro de usuarios.
2. Inicio de sesión y autenticación.
3. Gestión de perfiles de usuario.
4. Operaciones CRUD para productos.
5. Envío de correos electrónicos de bienvenida.

### Configuración
1. Instalar las dependencias ejecutando `npm install`.
2. Configurar las variables de entorno en un archivo `.env`.
3. Iniciar el servidor con `node index.js`.

### Endpoints Principales
- `/register`: POST para registrar un nuevo usuario.
- `/login`: POST para iniciar sesión.
- `/logout`: POST para cerrar sesión.
- `/profile`: GET para obtener el perfil de usuario.
- `/productos`: POST para agregar un nuevo producto.
- `/productos/:id/review`: POST para agregar una reseña a un producto.
- `/productos/:id/reviews`: GET para obtener las reseñas de un producto.
- `/productos/:id`: PUT para actualizar un producto.
- `/productos/:id`: DELETE para eliminar un producto.

### Notas Adicionales
- Se utiliza JWT para la autenticación de usuarios.
- Se implementa Multer para el almacenamiento de imágenes.
- Se envían correos electrónicos de bienvenida a los usuarios registrados.

