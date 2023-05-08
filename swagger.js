const path = require('path');
const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
      title: 'My API',
      description: 'Тестовое задание: API для приложения',
    },
    host: 'localhost:3000',
    schemes: ['http'],
  };

// путь и название генерируемого файла
const outputFile = path.join(__dirname, 'output.json');
console.log(outputFile)
// массив путей к роутерам
const endpointsFiles = [path.join(__dirname, './index.js')];

swaggerAutogen(outputFile, endpointsFiles, doc).then(({ success }) => {
 console.log(`Generated: ${success}`)
})