// js/busca.js — Lógica de busca e filtros dinâmicos conectados ao localStorage

document.addEventListener("DOMContentLoaded", () => {
  // --- BUSCA DE LIVROS ---
  const inputBuscaLivros = document.querySelector("#modal-busca-livros input[type='text']");
  const selectSortLivros = document.getElementById("sort-livros");
  const listaResultadosLivros = document.querySelector("#modal-busca-livros .results-list");

  // Atribuir IDs caso não estejam no HTML
  if (inputBuscaLivros && !inputBuscaLivros.id) inputBuscaLivros.id = "input-busca-livros";
  if (listaResultadosLivros && !listaResultadosLivros.id) listaResultadosLivros.id = "lista-resultados-livros";

  function renderizarLivros() {
    if (!listaResultadosLivros) return;

    const termo = inputBuscaLivros ? inputBuscaLivros.value.toLowerCase().trim() : "";
    const criterio = selectSortLivros ? selectSortLivros.value : "alfabetica";

    let livros = obterLivros(); // Pega do db.js

    // 1. Filtrar por título, autor ou gênero
    if (termo !== "") {
      livros = livros.filter(livro => 
        (livro.titulo && livro.titulo.toLowerCase().includes(termo)) || 
        (livro.autor && livro.autor.toLowerCase().includes(termo)) ||
        (livro.genero && livro.genero.toLowerCase().includes(termo))
      );
    }

    // 2. Ordenar conforme o select
    if (criterio === "alfabetica") {
      livros.sort((a, b) => a.titulo.localeCompare(b.titulo));
    } else if (criterio === "recentes") {
      livros.reverse(); // Inverte para mostrar os adicionados por último
    } else if (criterio === "lancamento") {
      livros.sort((a, b) => (b.ano || 0) - (a.ano || 0));
    } else if (criterio === "autor") {
      livros.sort((a, b) => (a.autor || "").localeCompare(b.autor || ""));
    }

    // Pegar até os 10 primeiros
    const exibidos = livros.slice(0, 10);

    // Limpar e redesenhar a lista HTML
    listaResultadosLivros.innerHTML = "";

    if (exibidos.length === 0) {
      listaResultadosLivros.innerHTML = `<li style="padding: 1rem; text-align: center; color: var(--text-muted);">Nenhum livro encontrado.</li>`;
      return;
    }

    exibidos.forEach(livro => {
      const li = document.createElement("li");
      li.innerHTML = `
        <a href="detalhe-livro.html?id=${livro.id}">
          <div class="item-info">
            <span>📖</span>
            <strong>${livro.titulo}</strong>
          </div>
          <span class="item-meta">${livro.autor} • ${livro.exemplares || 1} disp.</span>
        </a>
      `;
      listaResultadosLivros.appendChild(li);
    });
  }

  // --- BUSCA DE ALUNOS ---
  const inputBuscaAlunos = document.querySelector("#modal-busca-alunos input[type='text']");
  const selectSortAlunos = document.getElementById("sort-alunos");
  const listaResultadosAlunos = document.querySelector("#modal-busca-alunos .results-list");

  function renderizarAlunos() {
    if (!listaResultadosAlunos) return;

    const termo = inputBuscaAlunos ? inputBuscaAlunos.value.toLowerCase().trim() : "";
    const criterio = selectSortAlunos ? selectSortAlunos.value : "alfabetica";

    let alunos = obterAlunos(); // Pega do db.js

    // 1. Filtrar por nome ou CGM/matrícula
    if (termo !== "") {
      alunos = alunos.filter(aluno => 
        (aluno.nome && aluno.nome.toLowerCase().includes(termo)) || 
        (aluno.cgm && aluno.cgm.toLowerCase().includes(termo))
      );
    }

    // 2. Ordenar conforme o select
    if (criterio === "alfabetica") {
      alunos.sort((a, b) => a.nome.localeCompare(b.nome));
    } else if (criterio === "recentes") {
      alunos.reverse();
    } else if (criterio === "matricula") {
      alunos.sort((a, b) => (a.cgm || "").localeCompare(b.cgm || ""));
    }

    const exibidos = alunos.slice(0, 10);

    listaResultadosAlunos.innerHTML = "";

    if (exibidos.length === 0) {
      listaResultadosAlunos.innerHTML = `<li style="padding: 1rem; text-align: center; color: var(--text-muted);">Nenhum aluno encontrado.</li>`;
      return;
    }

    exibidos.forEach(aluno => {
      const li = document.createElement("li");
      li.innerHTML = `
        <a href="detalhe-aluno.html?id=${aluno.id}">
          <div class="item-info">
            <span>👤</span>
            <strong>${aluno.nome}</strong>
          </div>
          <span class="item-meta">Matrícula/CGM: ${aluno.cgm}</span>
        </a>
      `;
      listaResultadosAlunos.appendChild(li);
    });
  }

  // Ouvintes de eventos (Event Listeners)
  if (inputBuscaLivros) inputBuscaLivros.addEventListener("input", renderizarLivros);
  if (selectSortLivros) selectSortLivros.addEventListener("change", renderizarLivros);

  if (inputBuscaAlunos) inputBuscaAlunos.addEventListener("input", renderizarAlunos);
  if (selectSortAlunos) selectSortAlunos.addEventListener("change", renderizarAlunos);

  // Executar na carga inicial
  renderizarLivros();
  renderizarAlunos();
});