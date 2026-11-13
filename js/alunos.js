// js/alunos.js — Lógica para manipulação de alunos

document.addEventListener("DOMContentLoaded", () => {
  // Procura o formulário de cadastro de alunos na página
  const formCadastroAluno = document.querySelector("form");

  if (formCadastroAluno) {
    formCadastroAluno.addEventListener("submit", (evento) => {
      // 1. Evita que a página recarregue do jeito padrão do HTML
      evento.preventDefault();

      // 2. Captura os valores preenchidos nos campos do formulário
      const novoAluno = {
        nome: document.getElementById("nome").value,
        cgm: document.getElementById("cgm").value,
        turma: document.getElementById("turma").value,
        turno: document.getElementById("turno").value,
        telefone: document.getElementById("telefone").value,
        email: document.getElementById("email").value,
        observacoes: document.getElementById("observacoes").value
      };

      // 3. Salva no localStorage chamando a função que criamos no db.js
      salvarAluno(novoAluno);

      // 4. Aciona o popup verde de sucesso mudando o final da URL para #sucesso
      window.location.hash = "sucesso";
      
      // Limpa os campos do formulário para um novo cadastro
      formCadastroAluno.reset();
    });
  }
});