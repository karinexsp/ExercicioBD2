const model = require('../Model/Tarefa')

exports.listar = async (req,res)=>{
    try{
        const tarefas = await model.findAll()
        res.render('listar',{tarefas:tarefas,error:null})
    }catch(error){
        console.error('Não foi possível listar as tarefas', error)
    }
}
exports.adicionar = async (req,res)=>{
    try{
        const titulo = req.body.titulo
        const descricao = req.body.descricao
        const status = req.body.status
        const tarefa = await model.create({
            titulo: titulo,
            descricao: descricao,
            status: status
        })
        res.redirect('/')
    }catch(error){
        console.error('Erro ao adicionar tarefa',error)
    }
}
exports.pagEditar = async (req,res)=>{
    try{
        const id = parseInt(req.params.id, 10)
        const tarefa = await model.findByPk(id)
        res.render('editar',{tarefa:tarefa})

    }catch(error){
        console.error('Problema ao procurar os dados desta tarefa',error)
    }
}
exports.editar = async (req,res)=>{
    try{
        const id = req.params.id
        const titulo = req.body.titulo
        const descricao = req.body.descricao
        const status = req.body.status
        const dados = {
            titulo : titulo,
            descricao : descricao,
            status: status
        }
            const tarefa = await model.update(dados,{
            where:{ 
                id: id
            }
        })
        res.redirect('/')
    }catch(error){
        console.error('Erro ao editar tarefa')
    }
}
exports.excluir = async (req,res)=>{
    try{const id = req.params.id
        const tarefa = await model.destroy({
            where:{id:id}
        })
        res.redirect('/')
    }catch(error){
        console.error('Erro ao excluir tarefa,',error)
    }
}
