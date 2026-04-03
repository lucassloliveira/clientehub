const API_URL = "https://crudcrud.com/api/a66ac177c62b4953a47ba4e69d7c6212/clientes";

function mostrarToast(mensagem, tipo = "sucesso") {
    const toast = document.getElementById("toast");

    toast.textContent = mensagem;
    toast.className = tipo; //adiciona "sucesso" ou "erro"

    // Remove a classe após 3 segundos (some o toast)
    setTimeout(function() {
        toast.className = "";
    }, 3000);
}

async function listarClientes() {
    try {
        const response = await fetch(API_URL);
        const clientes = await response.json();

        //Pega o elmento <ul> do HTML
        const lista = document.getElementById('listaClientes');

        // Limpa a lista antes de renderizar
        lista.innerHTML = "";

        // Para cada cliente, cria um <li> e adiciona na lista
        clientes.forEach(function(cliente) {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${cliente.nome} - ${cliente.email}</span>
                <div>
                    <button class="btn-editar" data-id="${cliente._id}">Editar</button>
                    <button class="btn-delete" data-id="${cliente._id}">Excluir</button>
                </div>    
            `;

            const btnEditar = li.querySelector(".btn-editar");
            btnEditar.addEventListener("click", function() {
                ativarEditor(li, cliente)
            });

        
            lista.appendChild(li);

            // Pega o botão que acabou de ser criado e adiciona o evento
            const btnDelete = li.querySelector(".btn-delete");
            btnDelete.addEventListener("click", function() {
            const id = btnDelete.dataset.id;
            excluirClientes(id);
            });
        });
    } catch (erro) {
        console.error("Erro ao listar clintes: ", erro);
        mostrarToast("Não foi possível carregar os cientes", "erro")
    }    
} 

function ativarEditor(li, cliente) {
    // Substitui o conteúdo do li por campos aditáveis
    li.innerHTML = `
        <div>
            <input class="input-editar" id="editNome" value="${cliente.nome}" />
            <input class="input-editar" id="editEmail" value="${cliente.email}" />
        </div>
        <div>
            <button class="btn-salvar" data-id="${cliente.id}">Salvar</button>
            <button class="btn-cancelar">Cancelar</button>
        </div>    
    `;

    // Cancelar volta da lista original
    li.querySelector(".btn-cancelar").addEventListener("click", function() {
        listarClientes();
    });

    // Salvar chama o PUT
    li.querySelector(".btn-salvar").addEventListener("click", function() {
        const novoNome = document.getElementById("editNome").value.trim();
        const novoEmail = document.getElementById("editEmail").value.trim();

        if (!novoNome || !novoEmail) {
            mostrarToast("Preencha todos os campos!", "erro");
            return;
        }

        atualizarCliente(cliente._id, novoNome, novoEmail)
    });
}

async function cadastrarClientes() {
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();

    // Validação
    if (!nome || !email) {
        mostrarToast("Preencha nome e e-mail!", "erro")
        return;
    }

    // Monta o objeto que será enviado
    const novoCliente = { nome, email };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(novoCliente)
        });

        const clienteSalvo = await response.json();

        // Limpa os campos após cadastrar
        document.getElementById("nome").value = " ";
        document.getElementById("email").value = " ";

        // Atualiza a lista na tela
        listarClientes();
        
        mostrarToast("Cliente cadastrado com sucesso!")
    } catch (erro) {
        console.error("Erro ao cadastrar: ", erro);
        mostrarToast("Não foi possível cadastrar o cliente.", "erro")
    }
}

async function atualizarCliente(id, nome, email) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({nome, email})
        });

        mostrarToast("Cliente atualizado com sucesso!");

        // Atualiza a lista
        listarClientes();
    } catch (erro) {
        console.error("Erro ao atualizar:", erro);
        mostrarToast("Não foi possível atualizar o cliente.", "erro")
    }
}

async function excluirClientes(id) {
    try {
        console.log("Excluindo cliente com id: ", id);

        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"}
        });

        // Atualiza lista após excluir
        listarClientes();

        mostrarToast("Cliente removido.")
    } catch (erro) {
        console.error("Erro ao excluir: ", erro);
        mostrarToast("Não foi possívelexcluir o cliente", "erro")
    }    
}

document.getElementById("btnCadastrar").addEventListener("click", cadastrarClientes);

listarClientes();