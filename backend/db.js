const mysql = require('mysql2');

const conexao = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Cacatua98@',
  database: 'sistema_clientes'
});

conexao.connect((erro) => {
  if (erro) {
    console.error('Erro ao conectar ao MySQL:', erro);
    return;
  }
  console.log('Conectado ao MySQL com sucesso!');
});

module.exports = conexao;