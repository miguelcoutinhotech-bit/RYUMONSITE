// ======================================================================
// RYŪMON  |  produtos.js
// Página do cardápio: botões de categoria, ordenação e lista de pratos.
// ----------------------------------------------------------------------
// COMO LER OS COMENTÁRIOS (pra quem for ler meu código):
//   // ====== 1. TÍTULO ======   -> nível 1 (parte grande do arquivo)
//   // ==== 1.1 Título ====      -> nível 2 (subparte)
//   // ---- 1.1.1 título ----    -> nível 3 (detalhe pequeno)
//   // texto normal             -> explicação do que eu fiz, em português
// ======================================================================


// ======================================================================
// 1. VARIÁVEL DA PÁGINA
// ======================================================================

// Guarda qual categoria está escolhida agora. Começa em "todos".
var categoriaAtual = "todos";


// ======================================================================
// 2. INÍCIO DA PÁGINA
// ======================================================================

// ==== 2.1 iniciarProdutos: roda no onload do produtos.html ====
function iniciarProdutos() {
  // Se o usuário veio de um link tipo produtos.html?cat=ramen, já abre nessa categoria
  var c = pegarParametro("cat");
  if (c != "") { categoriaAtual = c; }
  desenharBotoes();
  mostrarProdutos();
}


// ======================================================================
// 3. BOTÕES DE CATEGORIA
// ======================================================================

// ==== 3.1 desenharBotoes: cria os botões (manipulação de DOM com innerHTML) ====
function desenharBotoes() {
  var html = "";
  for (var i = 0; i < categorias.length; i++) {
    var codigo = categorias[i][0];               // ex.: "sushi"
    var nome = categorias[i][1];                 // ex.: "Sushi"
    var marcado = (codigo == categoriaAtual);    // true se for o botão escolhido (fica dourado no CSS)
    html = html + '<button class="chip" aria-pressed="' + marcado + '" onclick="escolherCategoria(\'' + codigo + '\')">' + nome + "</button>";
  }
  document.getElementById("chips").innerHTML = html;
}

// ==== 3.2 escolherCategoria: clique em um botão ====
function escolherCategoria(codigo) {
  categoriaAtual = codigo;
  desenharBotoes();                              // redesenho pra mudar qual está dourado
  mostrarProdutos();
}


// ======================================================================
// 4. LISTA DE PRATOS
// ======================================================================

// ==== 4.1 mostrarProdutos: filtra, ordena e mostra ====
// Também é chamada pelo onchange do <select> de ordenação.
function mostrarProdutos() {
  // ---- 4.1.1 filtrar pela categoria ----
  var lista = [];
  for (var i = 0; i < produtos.length; i++) {
    if (categoriaAtual == "todos" || produtos[i].cat == categoriaAtual) {
      lista.push(produtos[i]);                   // push = coloca no final da lista
    }
  }
  // ---- 4.1.2 ordenar pelo que está no <select> ----
  var criterio = document.getElementById("ordem").value;
  lista = ordenarLista(lista, criterio);
  // ---- 4.1.3 mostrar na tela ----
  document.getElementById("grid").innerHTML = montarCards(lista);
}
