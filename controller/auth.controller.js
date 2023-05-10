const db = require('../db');
const {User} = require('../models/models');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateAccessToken = (id) => {
    const payload = {
        id,
    }
    return jwt.sign(payload, process.env.SECRET, {expiresIn: '24h'});
}

class AuthController {

    async registration(req, res) {

        // #swagger.summary = 'Регистрация пользователя'

        

        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(400).json({message: 'Ошбика при регистрации', errors});
            }
            const {username, password} = req.body;
            const candidat = await User.findOne({
                where: {
                    username: username
                }
            });
            if (candidat) {
                return res.status(400).json({message: 'Пользователь с таким username существует'});
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const user = await User.create({
                username: username,
                password: hashPassword
            });
            return res.json(user);
        } catch(e) {
            console.log(e);
            res.status(400).json({message: 'Registration error'});
        }
        /* #swagger.responses[200] = {
            description: 'Пользователь успешно зарегистрирован.',
            schema: 
                {
                    "id": 5,
                    "username": "anyss",
                    "password": "$2a$07$ME8/v/unjnKRJg65d8Jw0u9oOheC8X.wrf.HLwKvVnDvB2CgmOmBO",
                    "updatedAt": "2023-05-09T12:02:32.242Z",
                    "createdAt": "2023-05-09T12:02:32.242Z"
                }
        } */
    }

    async login(req, res) {

        // #swagger.summary = 'Авторизация пользователя с получением JWT токена'

        try {
            const {username, password} = req.body;
            const user = await User.findOne({
                where: {
                    username: username
                }
            });
            if (!user) {
                return res.status(400).json({message: 'Пользователь с таким username не найден'});
            }
            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).json({message: 'Введен неверный пароль'});
            }
            const token = generateAccessToken(user.id);
            return res.json({token});
        } catch(e) {
            console.log(e);
            res.status(400).json({message: 'Registration error'});
        } 
        /* #swagger.responses[200] = {
            description: 'Пользователь авторизован.',
            schema: 
                {
                    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNjgzNjMzODUzLCJleHAiOjE2ODM3MjAyNTN9.qqAMefPEKsSlODnbHpaX86tali_08wMmYU3coDvNMhU"
                }
        } */
    }
}

module.exports = new AuthController();