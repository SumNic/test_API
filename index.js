const express = require('express');
require('dotenv').config();
const formData = require("express-form-data");

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
app.use('/api', messagesRouter);
app.use('/api', authRouter);

app.listen(PORT, function() {
    console.log(`Server started: http://localhost:${PORT}`);
});