document.addEventListener("DOMContentLoaded", () => {
    // 1. Pega o ID do livro que veio na URL (ex: emprestar-livro.html?id=1)
    const urlParams = new URLSearchParams(window.location.search);
    const livroId = urlParams.get("id");

    const livros = obterLivros();
    let livroAtual = null;

    if (livroId) {
      livroAtual = livros.find(l => String(l.id) === String(livroId));
    }
    // Atualiza os links de retorno na página de edição para manter o ?id=
        document.querySelectorAll('a[href="detalhe-livro.html"]').forEach(link => {
            link.href = `detalhe-livro.html?id=${livroId}`;
        });
    // 2. Preenche dinamicamente o Bloco 1 (Livro Selecionado) com os dados reais
    const boxLivro = document.querySelector(".selected-book-box");
    if (livroAtual && boxLivro) {
      boxLivro.innerHTML = `
        <span>📚</span>
        <div class="book-details-text">
          <h4>${livroAtual.titulo}</h4>
          <p>Autor: ${livroAtual.autor} • ${livroAtual.exemplares} exemplares disponíveis</p>
        </div>
      `;
    } else if (boxLivro) {
      boxLivro.innerHTML = `
        <span>⚠️</span>
        <div class="book-details-text">
          <h4>Nenhum livro selecionado</h4>
          <p>Por favor, volte à página inicial ou de detalhes e escolha um livro.</p>
        </div>
      `;
    }

    // 3. Preenche as datas automaticamente (Hoje e daqui a 14 dias)
    const inputRetirada = document.getElementById("data-retirada");
    const inputDevolucao = document.getElementById("data-devolucao");

    if (inputRetirada && inputDevolucao) {
      const hoje = new Date();
      const daqui14Dias = new Date();
      daqui14Dias.setDate(hoje.getDate() + 14);

      inputRetirada.value = hoje.toISOString().split('T')[0];
      inputDevolucao.value = daqui14Dias.toISOString().split('T')[0];
    }

    // 4. Tratativa do botão "Cancelar" para voltar aos detalhes do livro correto
    const btnCancelar = document.querySelector(".btn-cancel");
    if (btnCancelar && livroId) {
      btnCancelar.href = `detalhe-livro.html?id=${livroId}`;
    }

    // 5. Intercepta o envio do formulário para salvar no localStorage
    const formEmprestimo = document.querySelector("form");
    if (formEmprestimo) {
      formEmprestimo.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!livroAtual || Number(livroAtual.exemplares) <= 0) {
          alert("Este livro não possui exemplares disponíveis para empréstimo.");
          return;
        }

        const inputAlunoTexto = document.getElementById("aluno").value.toLowerCase().trim();
        const alunos = obterAlunos();

        // Tenta achar o aluno digitado pelo Nome ou pelo CGM
        const alunoEncontrado = alunos.find(a => 
          a.nome.toLowerCase().includes(inputAlunoTexto) || 
          a.cgm.toLowerCase().includes(inputAlunoTexto)
        );

        if (!alunoEncontrado) {
          alert("Aluno não encontrado! Verifique se o nome ou CGM foi digitado corretamente ou cadastre o aluno.");
          return;
        }

        // Cria o registro do empréstimo
        const novoEmprestimo = {
          id: Date.now(),
          livroId: livroAtual.id,
          alunoId: alunoEncontrado.id,
          dataRetirada: inputRetirada.value.split('-').reverse().join('/'),
          dataDevolucao: inputDevolucao.value.split('-').reverse().join('/'),
          status: "ativo"
        };

        // Salva nos Empréstimos
        const emprestimos = obterEmprestimos();
        emprestimos.push(novoEmprestimo);
        localStorage.setItem('dihisavaen_emprestimos', JSON.stringify(emprestimos));

        // Desconta 1 exemplar do estoque do livro
        const livroIndex = livros.findIndex(l => String(l.id) === String(livroAtual.id));
        if (livroIndex !== -1) {
          livros[livroIndex].exemplares = Number(livros[livroIndex].exemplares) - 1;
          localStorage.setItem('dihisavaen_livros', JSON.stringify(livros));
        }

        // Ativa o sucesso (sua página já usa action="#sucesso")
        window.location.hash = "sucesso";

        // Redireciona para a Home (ou para o perfil do aluno) após 1.5 segundos
        setTimeout(() => {
          window.location.reload();
        }, 200);
      });
    }
  });