const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Importar Rutas y Middlewares
const authRoutes = require('./routes/authRoutes');
const { verificarToken } = require('./middlewares/authMiddleware');

const proveedorRoutes = require('./routes/proveedorRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const componenteRoutes = require('./routes/componenteRoutes');
const armadoRoutes = require('./routes/armadoRoutes');

// 2. Middlewares Globales 
app.use(cors());
app.use(express.json());

// ==========================================
// 3. CONFIGURACIÓN DE SWAGGER (PÚBLICO)
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
    
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'], 
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ==========================================
// 4. RUTAS PÚBLICAS (No requieren Token)
// ==========================================
app.get('/', (req, res) => {
  res.send('¡API de Custom PC Builder funcionando!');
});

// El login y registro son públicos
app.use('/api/auth', authRoutes);

// ==========================================
// 5. MIDDLEWARE DE SEGURIDAD
// ==========================================
// A partir de esta línea, TODO lo que esté abajo requiere Token
app.use(verificarToken); 

// ==========================================
// 6. RUTAS PROTEGIDAS (Requieren Token)
// ==========================================
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/componentes', componenteRoutes);
app.use('/api/armados', armadoRoutes);

// Encender el servidor
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Documentación Swagger en http://localhost:${PORT}/api-docs`);
  console.log(`=========================================`);
});