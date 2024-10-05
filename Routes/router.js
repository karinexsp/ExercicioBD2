const express = require('express')
const rotas = express.Router()
const controller = require('../Controller/TarefasController')
rotas.get('/',controller.listar)
rotas.get('/add',(req,res)=>{
    res.render('adicionar')
})
rotas.post('/add',controller.adicionar)
rotas.get('/editar/:id',controller.pagEditar)
rotas.post('/editar/:id',controller.editar)
rotas.get('/excluir/:id',controller.excluir)

module.exports = rotas