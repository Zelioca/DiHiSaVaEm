document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const alunoId = urlParams.get("id");

    if (!alunoId) {
      document.querySelector("main").innerHTML = `
        <div style="padding: 3rem; text-align: center; color: #fff;">
          <h2>Nenhum aluno selecionado.</h2>
          <a href="index.html" style="color: #a5b4fc; display:inline-block; margin-top:1rem;">Voltar ao Início</a>
        </div>`;
      return;
    }

    const alunos = obterAlunos();
    const aluno = alunos.find(a => String(a.id) === String(alunoId));

    if (!aluno) {
      document.querySelector("main").innerHTML = `
        <div style="padding: 3rem; text-align: center; color: #fff;">
          <h2>Aluno não encontrado no banco de dados.</h2>
          <a href="index.html" style="color: #a5b4fc; display:inline-block; margin-top:1rem;">Voltar ao Início</a>
        </div>`;
      return;
    }

    // 1. Preenche Nome e CGM/Matrícula no cabeçalho
    const elNome = document.querySelector("h1");
    const elSub = document.querySelector(".student-subtitle") || document.querySelector(".form-subtitle");
    if (elNome) elNome.textContent = aluno.nome;
    if (elSub) elSub.textContent = `CGM: ${aluno.cgm}`;

    // 2. Preenche a grade de informações (Turma, Turno, Contato, E-mail) na ordem exata do HTML
    const infoValues = document.querySelectorAll(".info-grid .info-value");
    if (infoValues.length >= 4) {
      const turnoFormatado = aluno.turno 
        ? aluno.turno.charAt(0).toUpperCase() + aluno.turno.slice(1) 
        : "Não informado";

      infoValues[0].textContent = aluno.turma || "Não informada";
      infoValues[1].textContent = turnoFormatado;
      infoValues[2].textContent = aluno.telefone || "Não informado";
      infoValues[3].textContent = aluno.email || "Não informado";
    }

    // 3. Preenche Observações
    const elObs = document.querySelector(".synopsis-box p");
    if (elObs) {
      elObs.textContent = aluno.observacoes || "Nenhuma observação cadastrada para este aluno.";
    }

    // 4. Passa o ID adiante no botão de editar
    const btnEditar = document.getElementById("btn-editar-aluno");
    if (btnEditar) btnEditar.href = `editar-aluno.html?id=${aluno.id}`;
    const btnDevolver = document.getElementById("btn-devolver-livro");
    if (btnDevolver) btnDevolver.href = `devolver-livro.html?id=${alunoId}`;

    // 5. Renderiza os Empréstimos Ativos com cálculo automático de prazo e multas
    const containerEmprestimos = document.querySelector(".loans-list");
    if (containerEmprestimos) {
      const emprestimos = obterEmprestimos();
      const livros = obterLivros();

      const emprestimosDoAluno = emprestimos.filter(e => String(e.alunoId) === String(alunoId) && e.status === "ativo");

      containerEmprestimos.innerHTML = "";

      if (emprestimosDoAluno.length === 0) {
        containerEmprestimos.innerHTML = `<div style="padding: 1rem; color: var(--text-muted); text-align: center;">Nenhum livro emprestado no momento.</div>`;
      } else {
        emprestimosDoAluno.forEach(emp => {
          const livroObj = livros.find(l => String(l.id) === String(emp.livroId));
          const tituloLivro = livroObj ? `${livroObj.titulo} — ${livroObj.autor}` : "Livro desconhecido";

          // --- LÓGICA INTELIGENTE DE DATAS E ATRASO ---
          // Converte "DD/MM/AAAA" para o formato de data do JS "AAAA-MM-DD"
          const partesDataDev = emp.dataDevolucao.split('/');
          const dataDevObj = new Date(`${partesDataDev[2]}-${partesDataDev[1]}-${partesDataDev[0]}`);
          
          const hoje = new Date();
          hoje.setHours(0, 0, 0, 0); // Zera as horas para comparar apenas os dias

          // Calcula a diferença em milissegundos e converte para dias
          const diferencaTempo = hoje - dataDevObj;
          const diasAtraso = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));

          let statusBadge = `<span class="loan-status-badge status-no-prazo" style="background: rgba(34, 197, 94, 0.15); color: #4ade80; padding: 0.3rem 0.75rem; border-radius: 12px; font-size: 0.8rem; font-weight: 600;">No Prazo</span>`;
          let textoMulta = "";
          let cardStyle = "";

          if (diasAtraso > 0) {
            // Está atrasado! Calcula a multa (ex: R$ 5,00 por dia)
            const valorMulta = diasAtraso * 5.00;
            statusBadge = `<span class="loan-status-badge status-vencido" style="background: rgba(239, 68, 68, 0.15); color: #f87171; padding: 0.3rem 0.75rem; border-radius: 12px; font-size: 0.8rem; font-weight: 600;">Vencido</span>`;
            textoMulta = ` <span class="fine-text" style="color: #f87171; font-weight: 600;">(Atrasado! Multa: R$ ${valorMulta.toFixed(2).replace('.', ',')})</span>`;
            cardStyle = `border: 1px solid rgba(239, 68, 68, 0.3);`;
          }

          const card = document.createElement("div");
          card.className = "loan-item-card";
          card.style.cssText = `background: rgba(255, 255, 255, 0.03); border-radius: 14px; padding: 1.25rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; ${cardStyle}`;
          
          card.innerHTML = `
            <div>
              <div class="loan-book-title" style="font-weight: 600; font-size: 1.05rem; color: #fff; margin-bottom: 0.3rem;">${tituloLivro}</div>
              <div class="loan-dates" style="font-size: 0.85rem; color: var(--text-muted); display: flex; gap: 1.5rem;">
                <span>Retirada: <strong>${emp.dataRetirada}</strong></span>
                <span>Entrega prevista: <strong>${emp.dataDevolucao}</strong>${textoMulta}</span>
              </div>
            </div>
            <div>
              ${statusBadge}
            </div>
          `;
          containerEmprestimos.appendChild(card);
        });
      }
    }
  });