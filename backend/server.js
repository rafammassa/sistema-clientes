const express = require('express');
const cors = require('cors');
const conexao = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// TESTE DE CONEXÃO
app.get('/', (req, res) => {
  res.send('API funcionando 🚀');
});

//CADASTRAR CLIENTE
app.post('/clientes', (req, res) => {
  const { nome, email, telefone, status } = req.body;

  const sql = `
    INSERT INTO clientes (nome, email, telefone, status)
    VALUES (?, ?, ?, ?)
  `;

  conexao.query(sql, [nome, email, telefone, status], (erro, resultado) => {
    if (erro) {
      console.error('Erro ao inserir cliente:', erro);
      return res.status(500).json({ erro: 'Erro ao cadastrar cliente' });
    }

    res.status(201).json({
      mensagem: 'Cliente cadastrado com sucesso',
      id: resultado.insertId
    });
  });
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});