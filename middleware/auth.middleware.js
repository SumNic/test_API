const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
    if (req.metod === 'OPTIONS') {
        next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(403).json({message: 'Пользователь не авторизован'});
        }
        const decodeData = jwt.verify(token, process.env.SECRET);
        req.user = decodeData;
        next();
    } catch (e) {
        console.log(e);
        return res.status(403).json({message: 'Пользователь не авторизован'});
    }
}