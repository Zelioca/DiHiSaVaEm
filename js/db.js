// js/db.js — Gerenciador do Banco de Dados Local (localStorage)

const DB_KEYS = {
  LIVROS: 'dihisavaen_livros',
  ALUNOS: 'dihisavaen_alunos',
  EMPRESTIMOS: 'dihisavaen_emprestimos'
};

// Dados iniciais de exemplo para o sistema já vir populado
const dadosIniciais = {
  livros: [
    { id: 1, titulo: "Dom Casmurro", autor: "Machado de Assis", genero: "romance", isbn: "978-85-359-0277-7", editora: "Companhia das Letras", ano: 1899, exemplares: 3, observacoes: "Obra-padrão da literatura brasileira." },
    { id: 2, titulo: "O Hobbit", autor: "J.R.R. Tolkien", genero: "fantasia", isbn: "978-85-336-1337-9", editora: "HarperCollins", ano: 1937, exemplares: 2, observacoes: "Clássico da literatura fantástica." }
  ],
  alunos: [
    { id: 1, nome: "Ana Silva", cgm: "123456789", turma: "3º Ano A - Ensino Médio", turno: "matutino", telefone: "(41) 99888-7766", email: "ana.silva@escola.com", observacoes: "Aluna exemplar." },
    { id: 2, nome: "Bruno Souza", cgm: "987654321", turma: "2º Ano B - Ensino Médio", turno: "vespertino", telefone: "(41) 97777-6655", email: "bruno.souza@escola.com", observacoes: "" }
  ],
  emprestimos: [
    { id: 1, livroId: 1, alunoId: 1, dataRetirada: "10/10/2026", dataDevolucao: "24/10/2026", status: "ativo" }
  ]
};

// Inicializa o banco caso esteja vazio
function inicializarBanco() {
  if (!localStorage.getItem(DB_KEYS.LIVROS)) {
    localStorage.setItem(DB_KEYS.LIVROS, JSON.stringify(dadosIniciais.livros));
  }
  if (!localStorage.getItem(DB_KEYS.ALUNOS)) {
    localStorage.setItem(DB_KEYS.ALUNOS, JSON.stringify(dadosIniciais.alunos));
  }
  if (!localStorage.getItem(DB_KEYS.EMPRESTIMOS)) {
    localStorage.setItem(DB_KEYS.EMPRESTIMOS, JSON.stringify(dadosIniciais.emprestimos));
  }
}

// Funções genéricas de Leitura (Buscar tudo)
function obterLivros() {
  return JSON.parse(localStorage.getItem(DB_KEYS.LIVROS)) || [];
}

function obterAlunos() {
  return JSON.parse(localStorage.getItem(DB_KEYS.ALUNOS)) || [];
}

function obterEmprestimos() {
  return JSON.parse(localStorage.getItem(DB_KEYS.EMPRESTIMOS)) || [];
}

// Funções genéricas de Salvamento (Adicionar novo item)
function salvarLivro(novoLivro) {
  const livros = obterLivros();
  novoLivro.id = Date.now(); // Gera um ID único baseado no milissegundo atual
  livros.push(novoLivro);
  localStorage.setItem(DB_KEYS.LIVROS, JSON.stringify(livros));
}

function salvarAluno(novoAluno) {
  const alunos = obterAlunos();
  novoAluno.id = Date.now();
  alunos.push(novoAluno);
  localStorage.setItem(DB_KEYS.ALUNOS, JSON.stringify(alunos));
}

// Executa a inicialização assim que o script é carregado
inicializarBanco();