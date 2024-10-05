const {Sequelize, DataTypes} = require('sequelize')
const sequelize = require('../Config/bd')
const tarefa = sequelize.define('Tarefa',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true

    },
    titulo:{
        type: DataTypes.STRING,
        allowNull: false
    },
    descricao:{
        type: DataTypes.TEXT
    },

    status:{
        type: DataTypes.STRING,
        defaultValue: "em aberto"
    },
    datacriacao:{
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }

},{
    tableName: 'tarefas',
    timestamps: false
})
module.exports = tarefa