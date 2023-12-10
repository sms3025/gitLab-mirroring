const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition: {
        openapi: "3.0.3",
        info: {
            title: 'Test API',
            version: '2.0.0',
            description: 'Test API with express',
        },
        host: 'localhost:3000',
        basePath: '/'
    },
    apis: ['./routes/*.js', './components/schemas/*']
};

const specs = swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    specs
};