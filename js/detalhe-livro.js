document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const livroId = urlParams.get("id");

    if (!livroId) {
      document.querySelector("main").innerHTML = `
        <div style="padding: 3rem; text-align: center; color: #fff;">
          <h2>Nenhum livro selecionado.</h2>
          <a href="index.html" style="color: #a5b4fc; display:inline-block; margin-top:1rem;">Voltar ao Início</a>
        </div>`;
      return;
    }

    const livros = obterLivros();
    const livro = livros.find(l => String(l.id) === String(livroId));

    if (!livro) {
      document.querySelector("main").innerHTML = `
        <div style="padding: 3rem; text-align: center; color: #fff;">
          <h2>Livro não encontrado no banco de dados.</h2>
          <a href="index.html" style="color: #a5b4fc; display:inline-block; margin-top:1rem;">Voltar ao Início</a>
        </div>`;
      return;
    }

    // 1. Preenche Título e Autor
    const elTitulo = document.querySelector(".book-title-area h1");
    const elAutor = document.querySelector(".book-author");
    if (elTitulo) elTitulo.textContent = livro.titulo;
    if (elAutor) elAutor.textContent = `por ${livro.autor}`;

    // 2. Preenche a grade de informações na ordem exata do seu HTML
    const infoValues = document.querySelectorAll(".info-grid .info-value");
    if (infoValues.length >= 4) {
      // Primeira letra do gênero em maiúscula
      const generoFormatado = livro.genero 
        ? livro.genero.charAt(0).toUpperCase() + livro.genero.slice(1) 
        : "Não informado";

      infoValues[0].textContent = generoFormatado;
      infoValues[1].textContent = livro.ano || "N/A";
      infoValues[2].textContent = `${livro.exemplares} disponíveis`;
      infoValues[3].textContent = livro.isbn || "Sem ISBN";
    }

    // 3. Preenche a Sinopse / Observações
    const elSinopse = document.querySelector(".synopsis-box p");
    if (elSinopse) {
      elSinopse.textContent = livro.observacoes || "Nenhuma observação cadastrada para este livro.";
    }

    // 4. Passa o ID adiante nos botões para não perder a referência!
    const btnEditar = document.getElementById("btn-editar-livro");
    const btnEmprestar = document.getElementById("btn-emprestar-livro");
    
    if (btnEditar) btnEditar.href = `editar-livro.html?id=${livro.id}`;
    if (btnEmprestar) btnEmprestar.href = `emprestar-livro.html?id=${livro.id}`;
  });