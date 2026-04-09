import { Cliente } from "./classes.js";
import { validarCampos, limparCampos, mostrarToast } from "./utils.js";

const API_URL = "https://crudcrud.com/api/f3538f75c8834da1945d38cf04005be0/clientes";

const ClienteService = {

    // SUBSTITUI: listarClientes()
    async listar() {
        const response = await fetch(API_URL)
        const dados = await response.json();
        // map() transforma cada objeto "cru" da API em um Cliente de verdade
        return dados.map(dado => Cliente.fromAPI(dado));
    },

    // SUBSTITUI: cadastrarClientes()
    async cadastrar(cliente) {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cliente) // chama toJSON()
        });
        const dados = await response.json();
        return Cliente.fromAPI(dados);
    },

    // SUBSTITUI: atualizarClientes(id, nome, email)
    async atualizar(cliente) {
        await fetch(`${API_URL}/${cliente.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cliente)
        });
    },

    // SUBSTITUÍ: excluirClientes(id)
    async excluir(id) {
        await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });
    }
};

// SUBSTITUI: lista.innerHTML e clientes.forEach() dentro de listarClientes()
function renderizarClientes(clientes) {
    const lista = document.getElementById("listaClientes");
    lista.innerHTML = "";

    // map() cria cada <li>, join() transforma o array em string HTML
    lista.innerHTML = clientes.map(cliente => `
        <li data-id="${cliente.id}">
            <span>${cliente.nome} - ${cliente.email}</span>
            <div>
                <button class="btn-editar">Editar</button>
                <button class="btn-delete">Excluir</button>
            </div>  
        </li>      
    `).join("");

    // Adiciona os eventos após renderizar o HTML
    lista.querySelectorAll("li").forEach((li, index) => {
        const cliente = clientes[index]; // find() pelo índice

        li.querySelector(".btn-editar").addEventListener("click", () => {
            ativarEditor(li, cliente);
        });

        li.querySelector(".btn-delete").addEventListener("click", () => {
            excluir(cliente.id);
        });
    });
}

// SUBSTITUI: ativarEditor()
function  ativarEditor(li, cliente) {
    li.innerHTML=`
        <div>
            <input class="input-editar" id="editNome" value="${cliente.nome}" />    
            <input class="input-editar" id="editEmail" value="${cliente.email}" />
        </div>
        <div>
            <button class="btn-salvar">Salvar</button>
            <button class="btn-cancelar">Cancelar</button>
        </div>        
    `;

    li.querySelector(".btn-cancelar").addEventListener("click", () => listar());

    li.querySelector(".btn-salvar").addEventListener("click", () => {
        const novoNome = document.getElementById("editNome").value.trim();
        const novoEmail = document.getElementById("editEmail").value.trim();

        // SUBSTITUI: validação manual por validarCampos()
        const erro = validarCampos(novoNome, novoEmail);
        if (erro) { mostrarToast(erro, "erro"); return; }

        atualizar(cliente.id, novoNome, novoEmail);
    });
}

// Ações
async function listar() {
    try {
        const clientes = await ClienteService.listar();
        renderizarClientes(clientes);
    } catch (erro) {
        mostrarToast("Não foi possível carregar os clientes.", "erro");
    }
}

async function cadastrar() {
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();

    // SUBSTITUI: if (!nome || !email) por validarCampos()
    const erro = validarCampos(nome, email);
    if (erro) { mostrarToast(erro, "erro"); return; }

    try {
        const novoCliente = new Cliente(nome, email);
        await ClienteService.cadastrar(novoCliente);

        limparCampos(["nome", "email"]);
        mostrarToast("Cliente cadastrado com sucesso!");
        listar();
    } catch (erro) {
        mostrarToast("Não foi possível cadastrar o cliente.", "erro");
    }
}

async function atualizar(id, nome, email) {
    try {
        const clienteAtualizado = new Cliente(nome, email, id);
        await ClienteService.atualizar(clienteAtualizado);
        mostrarToast("Cliente atualizado com sucesso");
        listar();
    } catch (erro) {
        mostrarToast("Não foi possível atualizar o cliente.", "erro")
    }
}

async function excluir(id) {
    try {
        await ClienteService.excluir(id);
        mostrarToast("Cliente removido.");
        listar();
    } catch (erro) {
        mostrarToast("Não foi possível excluir o cliente.", "erro");
    }
}


// Inicialização
document.getElementById("btnCadastrar").addEventListener("click", cadastrar);
listar();