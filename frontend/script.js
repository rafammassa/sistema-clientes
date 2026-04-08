const form = document.getElementById('form-cliente');
const listaClientes = document.getElementById('lista-clientes');
const botaoSubmit = document.querySelector('button[type="submit"]');
const campoBusca = document.getElementById('busca');
const modoEdicao = document.getElementById('modo-edicao');
const btnCancelar = document.getElementById('btn-cancelar');

const API_URL = 'http://localhost:3000/clientes';

let clienteEditandoId = null;
let todosClientes = [];

function renderizarClientes(clientes) {
  listaClientes.innerHTML = '';

  clientes.forEach((cliente) => {
    const div = document.createElement('div');
    div.classList.add('cliente-card');

    const classeStatus = cliente.status.toLowerCase().replace(/\s+/g, '-');

    div.innerHTML = `
      <p><strong>Nome:</strong> ${cliente.nome}</p>
      <p><strong>Email:</strong> ${cliente.email}</p>
      <p><strong>Telefone:</strong> ${cliente.telefone}</p>
      <p><strong>Status:</strong> 
        <span class="status ${classeStatus}">
          ${cliente.status}
        </span>
      </p>

      <button type="button" onclick="editarCliente(${cliente.id})">Editar</button>
      <button type="button" class="btn-excluir" onclick="excluirCliente(${cliente.id})">Excluir</button>
    `;

    listaClientes.appendChild(div);
  });
}

function atualizarResumo(clientes) {
  const total = clientes.length;

  const totalLeads = clientes.filter(cliente =>
    cliente.status.toLowerCase() === 'lead'
  ).length;

  const totalEmContato = clientes.filter(cliente =>
    cliente.status.toLowerCase() === 'em contato'
  ).length;

  const totalClientesFechados = clientes.filter(cliente =>
    cliente.status.toLowerCase() === 'cliente'
  ).length;

  const taxaConversao =
    total > 0 ? ((totalClientesFechados / total) * 100).toFixed(1) : 0;

  document.getElementById('total-clientes').textContent = total;
  document.getElementById('total-leads').textContent = totalLeads;
  document.getElementById('total-em-contato').textContent = totalEmContato;
  document.getElementById('total-clientes-fechados').textContent = totalClientesFechados;
  document.getElementById('taxa-conversao').textContent = `${taxaConversao}%`;
}

function cancelarEdicao() {
  clienteEditandoId = null;
  form.reset();
  botaoSubmit.textContent = 'Cadastrar';
  modoEdicao.classList.add('oculto');
  btnCancelar.classList.add('oculto');
}

btnCancelar.addEventListener('click', cancelarEdicao);

async function carregarClientes() {
  try {
    const resposta = await fetch(API_URL);
    const clientes = await resposta.json();

    todosClientes = clientes;
    renderizarClientes(clientes);
    atualizarResumo(clientes);
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
      modoEdicao.classList.remove('oculto');
      btnCancelar.classList.remove('oculto');
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

  if (!cliente.nome || !cliente.email || !cliente.telefone || !cliente.status) {
    mostrarMensagem('Preencha todos os campos.', 'erro');
    return;
  }

  if (!cliente.email.includes('@') || !cliente.email.includes('.')) {
    mostrarMensagem('Digite um email válido.', 'erro');
    return;
  }

  if (cliente.telefone.replace(/\D/g, '').length < 10) {
    mostrarMensagem('Digite um telefone válido com DDD.', 'erro');
    return;
  }

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
      mostrarMensagem('Cliente atualizado com sucesso!', 'sucesso');
    } else {
      await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
      });

      mostrarMensagem('Cliente cadastrado com sucesso!', 'sucesso');
    }

    form.reset();
    carregarClientes();
  } catch (erro) {
    console.error('Erro ao salvar cliente:', erro);
    mostrarMensagem('Erro ao salvar cliente.', 'erro');
  }
});

async function excluirCliente(id) {
  const confirmar = confirm('Tem certeza que deseja excluir este cliente?');

  if (!confirmar) return;

  try {
    const resposta = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (resposta.ok) {
      mostrarMensagem('Cliente excluído com sucesso!', 'sucesso');
      carregarClientes();
    } else {
      mostrarMensagem('Erro ao excluir cliente.', 'erro');
    }
  } catch (erro) {
    console.error('Erro ao excluir cliente:', erro);
    mostrarMensagem('Erro ao excluir cliente.', 'erro');
  }
}

const mensagem = document.getElementById('mensagem');

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;

  setTimeout(() => {
    mensagem.className = 'mensagem';
    mensagem.textContent = '';
  }, 3000);
}

campoBusca.addEventListener('input', () => {
  const termo = campoBusca.value.toLowerCase();

  const clientesFiltrados = todosClientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(termo) ||
    cliente.email.toLowerCase().includes(termo) ||
    cliente.status.toLowerCase().includes(termo)
  );

  renderizarClientes(clientesFiltrados);
  atualizarResumo(clientesFiltrados);
});

carregarClientes();