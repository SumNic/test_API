const { DataTypes } = require('sequelize');
const db = require('../db.js');

const Message = db.define('messages',
  {
    id: { 
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false
    },
    files: {
      type: DataTypes.STRING,
    },
  }
);

const User = db.define('users',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }
);

User.hasMany(Message);
Message.belongsTo(User);

User.sync({ alter: true }).then(()=>{
    console.log("Tables users have been created");
  }).catch(err=>console.log(err));

Message.sync({ alter: true }).then(()=>{
  console.log("Tables messages have been created");
}).catch(err=>console.log(err));

module.exports = { User, Message }