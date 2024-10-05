const request = require('supertest') //Para simular requisições HTTP à aplicação
const model = require('../Model/Tarefa') //arquivo que contém a definição de "Tarefa" sincronizado com o BD a partir do Sequelize
const app = require('../app') //arquivo que contém a configuração do servidor Express
const sinon = require('sinon') //para criar stubs e mocks, permitindo que você substitua funcionalidades reais por comportamentos simulados

describe('Testar funções do Controller',()=>{
    let expect
    before(async()=>{
        //Faz a importação do Chai de forma dinâmica já que ele não suporta mais o require
        const chai = await import ('chai')
        expect = chai.expect //Para usar a função expect, que facilita a verificação dos resultados.
    })
    it('Testar rota /',async()=>{
        //Cria uma lista de tarefas para simular do Banco de Dados
        const tarefaMock = [
            {id:1, titulo:'Tarefa1', 
            descricao:'Descriçao 1', status: 'Em aberto'},
            {id:2, titulo:'Tarefa2', 
            descricao:'Descriçao 2', status: 'Em aberto'}
        ]
        //Substitui a saída da função findAll
        model.findAll = ()=> Promise.resolve(tarefaMock)
        //Inicia requisição ao servidor usando rota get /
        const response = await request(app).get('/')
        //Checa se o status foi 'OK' 
        expect(response.status).to.equal(200)
        //Checa se a página de resposta contém a string 'Tarefa1
        expect(response.text).to.include('Tarefa1')
        //Checa se a página de resposta contém a string 'Tarefa2
        expect(response.text).to.include('Tarefa2')
    })
    it('testar rota /add',async()=>{
        // Mock do método model.create para não inserir dados reais durante o teste
        const createStub = sinon.stub(model, 'create').resolves({
            id: 10,
            titulo: 'Nova Tarefa',
            descricao: 'Descrição da tarefa',
            status: 'pendente'
        });

        // Simulação do envio de dados via POST
        const res = await request(app)
            .post('/add')
            .type('form')
            .send({
                titulo: 'Nova Tarefa',
                descricao: 'Descrição da tarefa',
                status: 'pendente'
            });
        
        // Verificação do redirecionamento para rota / após o sucesso
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/');

        
        //verifica se o stub foi chamado exatamente uma vez durante a execução do código.
        expect(createStub.calledOnce).to.be.true;
        /*verifica se se o primeiro argumento passado para model.create() 
        corresponde exatamente ao objeto esperado*/
        expect(createStub.firstCall.args[0]).to.deep.equal({
            titulo: 'Nova Tarefa',
            descricao: 'Descrição da tarefa',
            status: 'pendente'
        });

        // Restaura o método original após o teste
        createStub.restore();
    })
    it('testar rota get /editar/:id',async()=>{
        // Mock do método model.findByPk para evitar busca real no banco de dados
        const tarefaMock = {
            id: 1,
            titulo: 'Tarefa Exemplo',
            descricao: 'Descrição da tarefa exemplo',
            status: 'pendente'
        };
        
        const findByPkStub = sinon.stub(model, 'findByPk').resolves(tarefaMock);

        // Simulação da requisição GET para a rota de edição
        const res = await request(app)
            .get('/editar/1');

        // Verificações da resposta
        expect(res.status).to.equal(200);  // Verifica se a resposta tem status 200 (OK)
        expect(res.text).to.include('Tarefa Exemplo');  // Verifica se o título da tarefa aparece na view
        expect(res.text).to.include('Descrição da tarefa exemplo');  // Verifica se a descrição aparece

        // Verifica se o stub foi chamado corretamente
        expect(findByPkStub.calledOnce).to.be.true;
        expect(findByPkStub.firstCall.args[0]).to.equal(1);

        // Restaura o método original
        findByPkStub.restore();
    })
    it('testar rota post /editar/:id',async()=>{
        const updateStub = sinon.stub(model, 'update').resolves([1]);  // O método retorna um array com o número de linhas afetadas
        
        // Simulação do envio de dados via POST
        const res = await request(app)
            .post('/editar/1')  // Envia a requisição para editar a tarefa com id = 1
            .type('form')
            .send({
                titulo: 'Tarefa Atualizada',
                descricao: 'Descrição atualizada da tarefa',
                status: 'concluída'
            });

        // Verificações
        expect(res.status).to.equal(302);  // Verifica o redirecionamento
        expect(res.headers.location).to.equal('/');  // Verifica se o redirecionamento é para a página inicial

        // Verifica se o método update foi chamado com os dados corretos
        expect(updateStub.calledOnce).to.be.true;
        expect(updateStub.firstCall.args[0]).to.deep.equal({
            titulo: 'Tarefa Atualizada',
            descricao: 'Descrição atualizada da tarefa',
            status: 'concluída'
        });
        expect(updateStub.firstCall.args[1]).to.deep.equal({
            where: { id: '1' }  // O id é passado como string
        });

        // Restaura o comportamento original do método update após o teste
        updateStub.restore();
    })
    it('testar rota get /excluir/:id',async()=>{
        // Mock do método model.destroy para evitar que o banco de dados seja alterado
        const destroyStub = sinon.stub(model, 'destroy').resolves(1);  // Simula exclusão bem-sucedida (1 linha afetada)
        
        // Simulação da requisição POST para excluir a tarefa com id = 1
        const res = await request(app)
            .get('/excluir/1');  // Envia a requisição para a rota de exclusão

        // Verificações
        expect(res.status).to.equal(302);  // Verifica o redirecionamento
        expect(res.headers.location).to.equal('/');  // Verifica se o redirecionamento é para a página inicial

        // Verifica se o método destroy foi chamado corretamente
        expect(destroyStub.calledOnce).to.be.true;
        expect(destroyStub.firstCall.args[0]).to.deep.equal({
            where: { id: '1' }  // O id é passado como string
        });

        // Restaura o comportamento original do método destroy
        destroyStub.restore();
    })
})