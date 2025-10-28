import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Credit Jambo Admin API',
      version: '1.0.0',
      description: 'Admin backend API for Credit Jambo Savings Management System',
    },
    servers: [
      {
        url: 'http://localhost:5001/api',
        description: 'Development server',
      },
      {
        url: 'https://your-production-domain.com/api',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [
    './src/routes/*.ts', 
    './src/controllers/*.ts',
    './src/models/*.ts',
    './src/dtos/*.ts'
  ], // files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

export default specs;