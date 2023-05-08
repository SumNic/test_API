const db = require('../db');
const FilesController = require('./files.controller');
const { Message } = require('../models/models');

class MessagesController {

    async createMessage(req, res) {

        /*
        #swagger.summary = 'Создание сообщения'
        #swagger.autoBody=false
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['message'] = {
            in: 'formData',
            type: 'string',
            required: 'true',
            description: 'Введите сообщение',
        } 
        #swagger.parameters['file'] = {
            in: 'formData',
            type: 'file',
            description: 'Выберите файл',
        }            
        */ 
        const {message} = req.body;
        const user = req.user;
        const {file} = req.files;
        try {
             
            if (!message) {
                return res.status(400).json({message: 'Сообщение не может быть пустым'});
            }
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

        // #swagger.summary = 'Получение  всех сообщений с пагинацией по 20 сообщений'

        const { page } = req.query;
        const limitVal = 20;
        const offsetVal = (page - 1) * limitVal;
        const messages = await Message.findAll({ offset: offsetVal, limit: limitVal });
            return res.json(messages);
    }
    
    async updateMessage(req, res) {

        /*
        #swagger.summary = 'Редактирование сообщения'
        #swagger.autoBody=false
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['message'] = {
            in: 'formData',
            type: 'string',
            required: 'true',
            description: 'Введите сообщение',
        } 
        #swagger.parameters['file'] = {
            in: 'formData',
            type: 'file',
            description: 'Выберите файл',
        }            
        */ 

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
            
            const nameFile = messages.files || await FilesController.createFile(file);
            await FilesController.updateFile(file, nameFile);
            
            const editMessage = await messages.update({
                message: message,
                files: nameFile,
            });
            return res.json(editMessage);
        } catch(e) {
            console.log(e);
            res.status(400).json({message: 'Ошибка при редактировании сообщения'});
        }
    }
    async deleteMessage(req, res) {

        // #swagger.summary = 'Удаление сообщения по его Id'

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