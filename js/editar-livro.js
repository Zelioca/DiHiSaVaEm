const urlParams = new URLSearchParams(window.location.search);
const livroId = urlParams.get("id");

if (livroId) {
    const livros = obterLivros();
    const livro = livros.find(l => String(l.id) === String(livroId));

    if (livro) {
        // Preenche os inputs do formulário de edição com os dados salvos
        if (document.getElementById("titulo")) document.getElementById("titulo").value = livro.titulo || "";
        if (document.getElementById("autor")) document.getElementById("autor").value = livro.autor || "";
        if (document.getElementById("genero")) document.getElementById("genero").value = livro.genero || "";
        if (document.getElementById("isbn")) document.getElementById("isbn").value = livro.isbn || "";
        if (document.getElementById("editora")) document.getElementById("editora").value = livro.editora || "";
        if (document.getElementById("ano")) document.getElementById("ano").value = livro.ano || "";
        if (document.getElementById("exemplares")) document.getElementById("exemplares").value = livro.exemplares || "";
        if (document.getElementById("observacoes")) document.getElementById("observacoes").value = livro.observacoes || "";
    }
}

// Opcional: Quando salvar a edição, atualiza o item no localStorage
const formEdicao = document.querySelector("form");
if (formEdicao && livroId) {
    formEdicao.addEventListener("submit", (e) => {
        e.preventDefault();
        let livros = obterLivros();
        const index = livros.findIndex(l => String(l.id) === String(livroId));

        if (index !== -1) {
            // Atualiza os dados do objeto existente
            livros[index].titulo = document.getElementById("titulo").value;
            livros[index].autor = document.getElementById("autor").value;
            livros[index].genero = document.getElementById("genero").value;
            livros[index].isbn = document.getElementById("isbn").value;
            livros[index].editora = document.getElementById("editora").value;
            livros[index].ano = document.getElementById("ano").value;
            livros[index].exemplares = document.getElementById("exemplares").value;
            livros[index].observacoes = document.getElementById("observacoes").value;

            // Salva a lista atualizada no localStorage
            localStorage.setItem('dihisavaen_livros', JSON.stringify(livros));
            window.location.hash = "sucesso";
        }
        
    });
}
// Atualiza os links de retorno na página de edição para manter o ?id=
        document.querySelectorAll('a[href="detalhe-livro.html"]').forEach(link => {
            link.href = `detalhe-livro.html?id=${livroId}`;
        });