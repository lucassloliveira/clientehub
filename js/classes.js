export class Cliente {
    // Encapsulamento: dados protegidos com campos privados
    #id;
    #nome;
    #email;

    constructor(nome, email, id = null) {
        this.#nome = nome;
        this.#email = email;
        this.#id = id; // null quando ainda não foi salvo na API
    }

    // Getters: leitura controlada, sem permitir escrita direta
    get id() { return this.#id; }
    get nome() { return this.#nome }
    get email() { return this.#email }

    // Método toJSON(): Evita que campos privados (#) sejam ignorados pelo JS
    toJSON() {
        return { nome: this.#nome, email: this.#email };
    }

    // Factory Method Estático: Cria um cliente a partir do objeto "cru" que a API retorna
    static fromAPI(dados) {
        return new Cliente(dados.nome, dados.email, dados._id);
    }
}

