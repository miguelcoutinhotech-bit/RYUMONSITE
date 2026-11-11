// ======================================================================
// RYŪMON  |  index.js
// Página inicial: mostra os 4 pratos mais pedidos.
// ----------------------------------------------------------------------
// COMO LER OS COMENTÁRIOS (pra quem for ler meu código):
//   // ====== 1. TÍTULO ======   -> nível 1 (parte grande do arquivo)
//   // ==== 1.1 Título ====      -> nível 2 (subparte)
//   // ---- 1.1.1 título ----    -> nível 3 (detalhe pequeno)
//   // texto normal             -> explicação do que eu fiz, em português
// ======================================================================


// ======================================================================
// 1. INÍCIO DA PÁGINA INICIAL
// ======================================================================

// ==== 1.1 iniciarHome: roda no onload do index.html ====
function iniciarHome() {
  // ---- 1.1.1 copiar a lista ----
  // concat() sem nada dentro faz uma CÓPIA do array. Preciso da cópia porque o
  // sort muda a ordem da lista, e eu não quero bagunçar a lista original.
  var copia = produtos.concat();
  // ---- 1.1.2 ordenar pelo ranking ----
  copia = ordenarLista(copia, "popular");
  // ---- 1.1.3 pegar só os 4 primeiros ----
  // slice(0, 4) devolve os itens das posições 0, 1, 2 e 3
  var maisPedidos = copia.slice(0, 4);
  // ---- 1.1.4 jogar os cards na tela ----
  document.getElementById("popular").innerHTML = montarCards(maisPedidos);
}
