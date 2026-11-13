
document.addEventListener("DOMContentLoaded", () => {
    // 1. Pega o ID do aluno que veio na URL (ex: devolver-livro.html?id=1)
    const urlParams = new URLSearchParams(window.location.search);
    const alunoId = urlParams.get("id");

    if (!alunoId) {
        alert("Nenhum aluno foi especificado para a devolução.");
        window.location.href = "index.html";
        return;
    }
    // Atualiza os links de retorno na página de edição para manter o ?id=
        document.querySelectorAll('a[href="detalhe-aluno.html"]').forEach(link => {
            link.href = `detalhe-aluno.html?id=${alunoId}`;
        });
    const alunos = obterAlunos();
    const aluno = alunos.find(a => String(a.id) === String(alunoId));

    if (!aluno) {
        alert("Aluno não encontrado.");
        window.location.href = "index.html";
        return;
    }

    // 2. Preenche o Bloco 1 (Resumo do Aluno) com os dados reais
    const boxAluno = document.querySelector(".student-summary-box");
    if (boxAluno) {
        boxAluno.innerHTML = `
        <span>👤</span>
        <div class="student-details">
          <h4>${aluno.nome}</h4>
          <p>CGM: ${aluno.cgm} • ${aluno.turma || "Turma não informada"} (${aluno.turno || ""})</p>
        </div>
      `;
    }

    // 3. Puxa os empréstimos ativos e os livros do banco
    const emprestimos = obterEmprestimos();
    const livros = obterLivros();

    // Filtra apenas os empréstimos ATIVOS deste aluno específico
    const emprestimosAtivos = emprestimos.filter(e => String(e.alunoId) === String(alunoId) && e.status === "ativo");

    const selectLivro = document.getElementById("livro-devolucao");
    const cardMulta = document.querySelector(".fine-summary-card");

    if (emprestimosAtivos.length === 0) {
        if (selectLivro) {
            selectLivro.innerHTML = `<option value="">Este aluno não possui livros pendentes de devolução.</option>`;
            selectLivro.disabled = true;
        }
        if (cardMulta) cardMulta.style.display = "none";
        return;
    }

    // 4. Preenche o <select> com os livros emprestados reais
    selectLivro.innerHTML = "";
    emprestimosAtivos.forEach(emp => {
        const livroObj = livros.find(l => String(l.id) === String(emp.livroId));
        const tituloLivro = livroObj ? `${livroObj.titulo} — ${livroObj.autor}` : "Livro desconhecido";

        // Calcula o status para exibir no texto da opção
        const partesDataDev = emp.dataDevolucao.split('/');
        const dataDevObj = new Date(`${partesDataDev[2]}-${partesDataDev[1]}-${partesDataDev[0]}`);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const diasAtraso = Math.ceil((hoje - dataDevObj) / (1000 * 60 * 60 * 24));
        const textoPrazo = diasAtraso > 0 ? `Vencido em ${emp.dataDevolucao}` : `Prazo: ${emp.dataDevolucao}`;

        const option = document.createElement("option");
        option.value = emp.id; // Salvamos o ID do empréstimo no value
        option.textContent = `${tituloLivro} (${textoPrazo})`;
        selectLivro.appendChild(option);
    });

    function atualizarPainelMulta() {
      const emprestimoIdSelecionado = selectLivro.value;
      const empSelecionado = emprestimos.find(e => String(e.id) === String(emprestimoIdSelecionado));

      if (!empSelecionado) return;

      const partesDataDev = empSelecionado.dataDevolucao.split('/');
      const dataDevObj = new Date(`${partesDataDev[2]}-${partesDataDev[1]}-${partesDataDev[0]}`);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const diferenca = hoje - dataDevObj;
      const diasAtraso = Math.ceil(diferenca / (1000 * 60 * 60 * 24));

      const hojeFormatado = String(hoje.getDate()).padStart(2, '0') + '/' + 
                            String(hoje.getMonth() + 1).padStart(2, '0') + '/' + 
                            hoje.getFullYear();

      const detalhesDiv = document.querySelector(".fine-calculation-details");
      const totalDiv = document.querySelector(".fine-total");
      const headerDiv = document.querySelector(".fine-header span:first-child");
      const precoDiv = document.querySelector(".fine-header span:nth-of-type(2)");

      if (diasAtraso > 0) {
        // --- CASO ESTEJA ATRASADO (Alerta Vermelho) ---
        if (cardMulta) {
          cardMulta.style.display = "block";
          cardMulta.style.borderColor = "rgba(239, 68, 68, 0.4)"; // Borda vermelha
          cardMulta.style.background = "rgba(239, 68, 68, 0.05)"; // Fundo avermelhado leve
        }
        
        const valorMulta = diasAtraso * 5.00;

        if (headerDiv) {
            headerDiv.textContent = "Devolução com Atraso Detectada";
            headerDiv.style.color = "#f87171";
        }
        if (detalhesDiv) {
            detalhesDiv.style.borderTop = "1px dashed rgba(239, 68, 68, 0.2)";
          detalhesDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span>Data de Entrega Prevista:</span>
              <strong>${empSelecionado.dataDevolucao}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span>Data de Devolução Hoje:</span>
              <strong>${hojeFormatado}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Dias de Atraso acumulados:</span>
              <strong style="color: #f87171;">${diasAtraso} ${diasAtraso === 1 ? 'dia' : 'dias'} de atraso</strong>
            </div>
          `;
        }
        if (totalDiv) {
          totalDiv.style.color = "#f87171";
          totalDiv.textContent = `Multa Total a Cobrar: R$ ${valorMulta.toFixed(2).replace('.', ',')}`;
        }
      } else {
        // --- CASO ESTEJA NO PRAZO (Visual Neutro / Verde Suave) ---
        if (cardMulta) {
          cardMulta.style.display = "block";
          cardMulta.style.borderColor = "rgba(34, 197, 94, 0.3)"; // Borda verde suave
          cardMulta.style.background = "rgba(34, 197, 94, 0.03)"; // Fundo esverdeado leve
        }

        if (headerDiv) {
            headerDiv.textContent = "Devolução No Prazo";
            headerDiv.style.color = "#4ade80";
        }

        if (precoDiv) {
            precoDiv.textContent = "";
        }

        if (detalhesDiv) {
            detalhesDiv.style.borderTop = "1px dashed rgba(56, 231, 40, 0.2)";
          detalhesDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span>Data de Entrega Prevista:</span>
              <strong>${empSelecionado.dataDevolucao}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Status:</span>
              <strong style="color: #4ade80;">Dentro do prazo (Sem multa)</strong>
            </div>
          `;
        }
        if (totalDiv) {
          totalDiv.style.color = "#4ade80"; // Deixa o texto verde
          totalDiv.textContent = "Multa Total a Cobrar: R$ 0,00";
        }
      }
    }

    // Executa ao carregar e ao trocar de livro no select
    atualizarPainelMulta();
    selectLivro.addEventListener("change", atualizarPainelMulta);

    // 6. Botão de Cancelar leva de volta ao perfil do aluno correto
    const btnCancelar = document.querySelector(".btn-cancel");
    if (btnCancelar) btnCancelar.href = `detalhe-aluno.html?id=${alunoId}`;

    // 7. Confirmação da Devolução (Dar baixa)
    const formDevolucao = document.querySelector("form");
    if (formDevolucao) {
        formDevolucao.addEventListener("submit", (e) => {
            e.preventDefault();

            const emprestimoId = selectLivro.value;
            const indexEmp = emprestimos.findIndex(e => String(e.id) === String(emprestimoId));

            if (indexEmp === -1) {
                alert("Selecione um empréstimo válido.");
                return;
            }

            // Muda status para devolvido
            emprestimos[indexEmp].status = "devolvido";
            localStorage.setItem('dihisavaen_emprestimos', JSON.stringify(emprestimos));

            // Devolve o exemplar ao estoque do livro
            const livroId = emprestimos[indexEmp].livroId;
            const indexLivro = livros.findIndex(l => String(l.id) === String(livroId));
            if (indexLivro !== -1) {
                livros[indexLivro].exemplares = Number(livros[indexLivro].exemplares) + 1;
                localStorage.setItem('dihisavaen_livros', JSON.stringify(livros));
            }

            // Ativa a tela/hash de sucesso
            window.location.hash = "sucesso";

            setTimeout(() => {
          window.location.reload();
        }, 200);
        });
    }
});