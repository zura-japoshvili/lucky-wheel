// src/config/swaggerConfig.ts
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import config from './config';

const FULL_API_URL = `${config.API_URL}:${config.port}`;

const swaggerDefinition = {
  definition: {
    openapi: "3.0.0", 
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API Documentation for the project",
    },
    servers: [
      {
        url: FULL_API_URL,
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', 
        },
      },
    },
    security: [
      {
        BearerAuth: [] as any,
      },
    ],
  },
  apis: [
    path.join(__dirname, '../routes/*.ts'),  
    path.join(__dirname, '../controllers/*.ts'),
  ],
};

const swaggerConfig = swaggerJsdoc(swaggerDefinition);

export default swaggerConfig;