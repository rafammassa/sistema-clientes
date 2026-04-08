const form = document.getElementById('form-cliente');
const listaClientes = document.getElementById('lista-clientes');

const API_URL = 'http://localhost:3000/clientes';

async function carregarClientes() {
  try {
    const resposta = await fetch(API_URL);
    const clientes = await resposta.json();

    listaClientes.innerHTML = '';

    clientes.forEach((cliente) => {
      const div = document.createElement('div');
      div.classList.add('cliente-card');

      div.innerHTML = `
        <p><strong>ID:</strong> ${cliente.id}</p>
        <p><strong>Nome:</strong> ${cliente.nome}</p>
        <p><strong>Email:</strong> ${cliente.email}</p>
        <p><strong>Telefone:</strong> ${cliente.telefone}</p>
        <p><strong>Status:</strong> ${cliente.status}</p>

        <button onclick="editarCliente(${cliente.id})">Editar</button>
        <button class="btn-excluir" onclick="excluirCliente(${cliente.id})">Excluir</button>
      `;

      listaClientes.appendChild(div);
    });
  } catch (erro) {
    console.error('Erro ao carregar clientes:', erro);
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const novoCliente = {
    nome: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    telefone: document.getElementById('telefone').value,
    status: document.getElementById('status').value
  };

  try {
    const resposta = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(novoCliente)
    });

    if (resposta.ok) {
      form.reset();
      carregarClientes();
    }
  } catch (erro) {
    console.error('Erro ao cadastrar cliente:', erro);
  }
});

async function excluirCliente(id) {
  try {
    const resposta = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (resposta.ok) {
      carregarClientes();
    }
  } catch (erro) {
    console.error('Erro ao excluir cliente:', erro);
  }
}

function editarCliente(id) {
  const nome = prompt('Novo nome:');
  const email = prompt('Novo email:');
  const telefone = prompt('Novo telefone:');
  const status = prompt('Novo status (lead, em contato, cliente):');

  fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nome, email, telefone, status })
  })
    .then(() => carregarClientes())
    .catch((erro) => console.error('Erro ao editar:', erro));
}

carregarClientes();