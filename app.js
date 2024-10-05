const {Sequelize} = require('sequelize')
const express = require('express')
const sequelize = require('./Config/bd')
const Tarefa = require('./Model/Tarefa')
const router = require('./Routes/router')
const app = express()
/*Conectar ao mysql com usuario e senha
sequelize.authenticate()
.then(() => {
console.log('Conexão com o banco de dados estabelecida com sucesso.');
})
.catch(err => {
console.error('Não foi possível conectar ao banco de dados:', err);
})
//Sincroniza para checar os dados do model
sequelize.sync()
.then(() => {
console.log('Model sincronizado com o banco de dados.');
})
.catch(err => {
console.error('Erro ao sincronizar o model com o banco de dados:', err);
});*/
const port = process.env.port || 3000
app.use(express.urlencoded({extended:true}))
app.set('view engine','ejs')
app.set('views','./View')
app.use('/',router)
module.exports = app
app.listen(port,()=>{
    console.log('Servidor Rodando na porta 3000')
})
