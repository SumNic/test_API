const Router = require('express');
const router = new Router();
const authController = require(`../controller/auth.controller`);
const {check} = require('express-validator');
const authMiddleware = require('../middleware/auth.middleware');


router.post('/registration', [
    check('username', 'username не может быть пустым').notEmpty(),
    check('password', 'Пароль должен быть длиннее 4 и менее 10 символов').isLength({min:4, max:10}),
], authController.registration);
router.post('/login', authController.login);
router.get('/users', authMiddleware, authController.getUser);

module.exports = router;  