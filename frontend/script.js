const form = document.getElementById('form-cliente');
const listaClientes = document.getElementById('lista-clientes');
const botaoSubmit = document.querySelector('button[type="submit"]');

const API_URL = 'http://localhost:3000/clientes';

let clienteEditandoId = null;

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

        <button type="button" onclick="editarCliente(${cliente.id})">Editar</button>
        <button type="button" class="btn-excluir" onclick="excluirCliente(${cliente.id})">Excluir</button>
      `;

      listaClientes.appendChild(div);
    });
  } catch (erro) {
    console.error('Erro ao carregar clientes:', erro);
  }
}

function editarCliente(id) {
  fetch(API_URL)
    .then((resposta) => resposta.json())
    .then((clientes) => {
      const cliente = clientes.find((c) => c.id == id);

      if (!cliente) {
        alert('Cliente não encontrado.');
        return;
      }

      document.getElementById('nome').value = cliente.nome;
      document.getElementById('email').value = cliente.email;
      document.getElementById('telefone').value = cliente.telefone;
      document.getElementById('status').value = cliente.status;

      clienteEditandoId = id;
      botaoSubmit.textContent = 'Atualizar';
    })
    .catch((erro) => {
      console.error('Erro ao buscar cliente para edição:', erro);
    });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const cliente = {
    nome: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    telefone: document.getElementById('telefone').value,
    status: document.getElementById('status').value
  };

  try {
    if (clienteEditandoId !== null) {
      await fetch(`${API_URL}/${clienteEditandoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
      });

      clienteEditandoId = null;
      botaoSubmit.textContent = 'Cadastrar';
    } else {
      await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
      });
    }

    form.reset();
    carregarClientes();
  } catch (erro) {
    console.error('Erro ao salvar cliente:', erro);
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

carregarClientes();