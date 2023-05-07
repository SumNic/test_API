const db = require('../db');
const FilesController = require('./files.controller');
const { Message } = require('../models/models');

class MessagesController {

    async createMessage(req, res) {
        const {message} = req.body;
        const user = req.user;
        const {file} = req.files;
        try {
            const nameFile = await FilesController.createFile(file);
            const messages = await Message.create({
                message: message,
                files: nameFile,
                userId: user.id
            });
            return res.json(messages);
        } catch(e) {
            console.log(e);
            res.status(400).json({message: 'Ошибка при сохранении сообщения'});
        }
    }

    async getMessages(req, res) {
        const { page } = req.query;
        const limitVal = 20;
        const offsetVal = (page - 1) * limitVal;
        console.log(page)
        const messages = await Message.findAll({ offset: offsetVal, limit: limitVal });
            return res.json(messages);
    }
    
    async updateMessage(req, res) {
        const id = req.params.id;
        const user = req.user;
        const {message} = req.body;
        const {file} = req.files;
        
        try {
            const messages = await Message.findByPk(id);
            if (!messages) {
                return res.status(400).json({message: 'Указанное сообщение не существует'});
            }            
            if (messages.userId !== user.id) {
                return res.status(400).json({message: 'Вы не можете изменить данное сообщение'});
            }
            if (file) {
                const nameFile = messages.files;
                await FilesController.updateFile(file, nameFile);
            }
            
            const editMessage = await messages.update({
                message: message,
            });
            return res.json(editMessage);
        } catch(e) {
            console.log(e);
            res.status(400).json({message: 'Ошибка при редактировании сообщения'});
        }
    }
    async deleteMessage(req, res) {
        const id = req.params.id;
        const user = req.user;
        try {
            const messages = await Message.findByPk(id);
            if (!messages) {
                return res.status(400).json({message: 'Указанное сообщение не существует'});
            }            
            if (messages.userId !== user.id) {
                return res.status(400).json({message: 'Вы не можете удалить данное сообщение'});
            }
            await FilesController.deleteFile(messages.files);
            await messages.destroy();
            return res.status(400).json({message: 'Сообщение удалено'});
        } catch(e) {
            console.log(e);
            res.status(400).json({message: 'Ошибка при удалении файла'});
        }
    }
}

module.exports = new MessagesController();