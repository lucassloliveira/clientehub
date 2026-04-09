// Validação de email com regex
const emailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Valida os dois campos de um vez
export const validarCampos = (nome, email) => {
    if (!nome || !email)        return "Preencha nome e e-mail!";
    if (!emailValido(email))    return "Digite um e-mail válido!";
    return null; // null = sem erros  
};

// Limpar campos recebe um array de IDs
export const limparCampos = (ids) => {
    ids.forEach(id => {
        document.getElementById(id).value = "";
    });
};

// Gerencia o toast de feedback ao usuário
export const mostrarToast = (mensagem, tipo = "sucesso") => {
    const toast = document.getElementById("toast");

    toast.textContent = mensagem;
    toast.className = tipo; // aplica o "sucesso" ou "erro"

    // Limpa o timer anterior se o toast for chamado
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.className="";
    }, 3000);
};