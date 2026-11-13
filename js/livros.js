// js/livros.js — Lógica para manipulação de livros

document.addEventListener("DOMContentLoaded", () => {
  // Procura o formulário de cadastro de livros na página
  const formCadastroLivro = document.querySelector("form");

  if (formCadastroLivro) {
    formCadastroLivro.addEventListener("submit", (evento) => {
      // 1. Previne o comportamento padrão de recarregar a página bruscamente
      evento.preventDefault();

      // 2. Captura os dados preenchidos nos inputs usando seus IDs ou names
      const novoLivro = {
        titulo: document.getElementById("titulo").value,
        autor: document.getElementById("autor").value,
        genero: document.getElementById("genero").value,
        isbn: document.getElementById("isbn").value,
        editora: document.getElementById("editora").value,
        ano: document.getElementById("ano").value,
        exemplares: document.getElementById("exemplares").value,
        observacoes: document.getElementById("observacoes").value
      };

      // 3. Salva no localStorage usando a função do nosso db.js
      salvarLivro(novoLivro);

      // 4. Ativa o popup de sucesso alterando a URL para #sucesso
      window.location.hash = "sucesso";
      
      // Opcional: limpa o formulário após salvar
      formCadastroLivro.reset();
    });
  }
});