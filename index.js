const express = require('express');
require('dotenv').config();
const formData = require("express-form-data");
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = JSON.parse(fs.readFileSync('./output.json'));
const messagesRouter = require('./routes/messages.routes');
const authRouter = require('./routes/auth.routes');
const db = require('./db.js')
db.authenticate()
    .catch(error => console.error(error));

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(formData.parse());
app.use('/api', authRouter
// #swagger.tags = ['Пользователи']
);
app.use('/api', messagesRouter
// #swagger.tags = ['Сообщения']
);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, function() {
    console.log(`Server started: http://localhost:${PORT}`);
});