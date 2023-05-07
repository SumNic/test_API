const Router = require('express');
const router = new Router();
const messagesController = require(`../controller/messages.controller`);
const authMiddleware = require('../middleware/auth.middleware');
// const formidable = require('express-formidable');

router.post('/message', authMiddleware, messagesController.createMessage);
router.get('/messages', messagesController.getMessages);
router.put('/message/:id', authMiddleware, messagesController.updateMessage);
router.delete('/message/delete/:id', authMiddleware, messagesController.deleteMessage);

module.exports = router;