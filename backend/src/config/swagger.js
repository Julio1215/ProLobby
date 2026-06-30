const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HUB GAMER API',
      version: '1.0.0',
      description: 'API completa do HUB GAMER — notícias, QCD, reviews e fichas RPG',
      contact: { name: 'HUB GAMER Dev' },
    },
    servers: [
      { url: 'http://localhost:3001', description: 'Desenvolvimento' },
      { url: 'https://hub-gamer-api.railway.app', description: 'Produção' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            username: { type: 'string' },
            displayName: { type: 'string' },
            avatarUrl: { type: 'string' },
            role: { type: 'string', enum: ['USER', 'MODERATOR', 'ADMIN'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Game: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            coverUrl: { type: 'string' },
            releaseDate: { type: 'string' },
            platforms: { type: 'array', items: { type: 'string' } },
            genres: { type: 'array', items: { type: 'string' } },
            metacriticScore: { type: 'number' },
            rawgRating: { type: 'number' },
            hoursMain: { type: 'number' },
            hoursComplete: { type: 'number' },
            priceUsd: { type: 'number' },
            qcdScore: { type: 'number' },
            qcdCategory: {
              type: 'string',
              enum: ['EXCELLENT', 'GOOD', 'REASONABLE', 'NOT_WORTH'],
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec };
