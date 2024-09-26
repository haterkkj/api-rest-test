import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config()
const uri = process.env.MONGODB_URL

const client = new MongoClient(uri);

const app = express();
app.use(express.json());

app.post('/usuarios', async (req, res) => {
    try{
        const database = client.db("users");
        const users = database.collection("users");

        const conteudo = {
            nome: req.body.nome,
            tamanhodapeca: req.body.tamanhodapeca
        }

        const result = await users.insertOne(conteudo);
        console.log(`Usuário ${req.body.nome} inserido com sucesso no banco de dados`);
        res.status(201).send(`Usuário ${req.body.nome} inserido com sucesso no banco de dados`);
    } finally {
        console.log("vai se fude");
    }
});

app.get('/usuarios', async (req, res) => {
    try{
        const database = client.db("users");
        const users = database.collection("users");
        const userList = await users.find({}).toArray();

        res.status(200).send(userList);
    } catch (err) {
        // Em caso de erro, retorna uma mensagem adequada
        res.status(500).send({ message: 'Erro ao buscar usuários', error: err });
    } finally {
        console.log("Consulta de usuários realizada");
    }
});

app.put('/usuarios/:id', async (req, res) => {
    try{
        const database = client.db("users");
        const users = database.collection("users");

        const userId = new ObjectId(req.params.id);
        const filter = {_id: userId};
        let resultado = await users.findOne(filter);
        if(!resultado){
            console.log(`usuario nao encontrado`);
            throw new Error("Usuário não encontrado");
        }

        const update = {
            $set: {
                tamanhodapeca: req.body.tamanhodapeca
            }
        };

        const result = await users.updateOne(filter, update);
        console.log(
            `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
          );
        res.status(200).send('ok');
    } catch (err) {
        // Em caso de erro, retorna uma mensagem adequada
        res.status(500).send({ message: 'Erro ao buscar usuários', error: err });
    } finally {
        console.log("Atualização de usuários realizada");
    }
});

app.delete('/usuarios/:id', async (req, res) => {
    try{
        const database = client.db("users");
        const users = database.collection("users");

        const userId = new ObjectId(req.params.id);
        const filter = {_id: userId};
        let resultado = await users.findOne(filter);
        if(!resultado){
            console.log(`usuario nao encontrado`);
            throw new Error("Usuário não encontrado");
        }


        const result = await users.deleteOne(filter);
        console.log(`usuario ${resultado.nome} de id: ${req.params.id} deletado com sucesso`);
        res.status(200).send('ok');
    } catch (err) {
        // Em caso de erro, retorna uma mensagem adequada
        res.status(500).send({ message: 'Erro ao encontrar usuário', error: err });
    } finally {
        console.log("Deleção de usuários realizada");
    }
});

app.listen(3000);

/*
thiago
6RnVclZkmzfEOvrl
*/
