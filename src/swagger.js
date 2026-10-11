const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Custom PC Builder API',
            version: '1.0.0',
            description: 'API para la aplicación de armado de computadoras',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    // ⚠️ ESTA LÍNEA ES LA CLAVE
    apis: ['./src/routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;