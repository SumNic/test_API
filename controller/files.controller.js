const db = require('../db');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

class FilesController {

    async createFile(file) {
        try {
            if (!file) return null;
            const fileName = uuid.v4() + '.' + file.name.split('.').reverse()[0];
            const filePath = path.resolve(__dirname, '..', 'static');
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, {recursive: true});
            }
            fs.copyFileSync(file.path, path.join(filePath, fileName));
            return fileName;
        } catch (e) {
            return res.status(500).json({message: 'Произошла ошибка при записи файла'});
        }
    }

    async updateFile(file, nameFile) {
        try {
            const fileName = nameFile;
            const filePath = path.resolve(__dirname, '..', 'static');
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, {recursive: true});
            }
            fs.copyFileSync(file.path, path.join(filePath, fileName));
            return fileName;
        } catch (e) {
            return res.status(500).json({message: 'Произошла ошибка при записи файла'});
        }
    }

    async deleteFile(nameFile) {
        try {
            const fileName = nameFile;
            const filePath = path.resolve(__dirname, '..', 'static');
            fs.unlinkSync(path.join(filePath, fileName));
        } catch (e) {
            return res.status(500).json({message: 'Произошла ошибка при удалении файла'});
        }
    }
}

module.exports = new FilesController();