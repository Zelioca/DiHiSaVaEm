document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const alunoId = urlParams.get("id");

    if (alunoId) {
        const alunos = obterAlunos();
        const aluno = alunos.find(a => String(a.id) === String(alunoId));

        if (aluno) {
            // Preenche os campos do formulário com os dados salvos
            if (document.getElementById("nome")) document.getElementById("nome").value = aluno.nome || "";
            if (document.getElementById("cgm")) document.getElementById("cgm").value = aluno.cgm || "";
            if (document.getElementById("turma")) document.getElementById("turma").value = aluno.turma || "";
            if (document.getElementById("turno")) document.getElementById("turno").value = aluno.turno || "";
            if (document.getElementById("telefone")) document.getElementById("telefone").value = aluno.telefone || "";
            if (document.getElementById("email")) document.getElementById("email").value = aluno.email || "";
            if (document.getElementById("observacoes")) document.getElementById("observacoes").value = aluno.observacoes || "";
        }

        // Mantém o ID nos links de retorno ("Voltar" e "Cancelar")
        document.querySelectorAll('a[href="detalhe-aluno.html"]').forEach(link => {
            link.href = `detalhe-aluno.html?id=${alunoId}`;
        });

        // Salva as alterações feitas no formulário
        const formEdicao = document.querySelector("form");
        if (formEdicao) {
            formEdicao.addEventListener("submit", (e) => {
                e.preventDefault();
                let alunos = obterAlunos();
                const index = alunos.findIndex(a => String(a.id) === String(alunoId));

                if (index !== -1) {
                    alunos[index].nome = document.getElementById("nome").value;
                    alunos[index].cgm = document.getElementById("cgm").value;
                    alunos[index].turma = document.getElementById("turma").value;
                    alunos[index].turno = document.getElementById("turno").value;
                    alunos[index].telefone = document.getElementById("telefone").value;
                    alunos[index].email = document.getElementById("email").value;
                    alunos[index].observacoes = document.getElementById("observacoes").value;

                    // Salva a lista atualizada no localStorage
                    localStorage.setItem('dihisavaen_alunos', JSON.stringify(alunos));
                    window.location.hash = "sucesso";
                }
            });
        }
    }
});