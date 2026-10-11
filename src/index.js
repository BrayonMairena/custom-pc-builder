const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const prisma = require('./lib/prisma'); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 1. IMPORTAR LAS RUTAS
// ==========================================
const proveedorRoutes = require('./routes/proveedorRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const componenteRoutes = require('./routes/componenteRoutes');
const armadoRoutes = require('./routes/armadoRoutes');

// Configuración de Middlewares
app.use(cors());
app.use(express.json());

// ==========================================
// 2. CONFIGURACIÓN DE SWAGGER
// ==========================================
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Custom PC Builder API',
      version: '1.0.0',
      description: 'API para la aplicación de armado de computadoras',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ['./src/routes/*.js'], 
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Ruta de prueba inicial
app.get('/', (req, res) => {
  res.send('¡API de Custom PC Builder funcionando!');
});

// ==========================================
// 3. MONTAR LAS RUTAS EN EL SERVIDOR
// ==========================================
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/componentes', componenteRoutes);
app.use('/api/armados', armadoRoutes);

// Encender el servidor
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
  console.log(` Documentación Swagger en http://localhost:${PORT}/api-docs`);
  console.log(`=========================================`);
});