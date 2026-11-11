// ======================================================================
// RYŪMON  |  busca.js
// Página de busca: pesquisa por texto + filtros de categoria e preço.
// ----------------------------------------------------------------------
// COMO LER OS COMENTÁRIOS (pra quem for ler meu código):
//   // ====== 1. TÍTULO ======   -> nível 1 (parte grande do arquivo)
//   // ==== 1.1 Título ====      -> nível 2 (subparte)
//   // ---- 1.1.1 título ----    -> nível 3 (detalhe pequeno)
//   // texto normal             -> explicação do que eu fiz, em português
// ======================================================================


// ======================================================================
// 1. INÍCIO DA PÁGINA
// ======================================================================

// ==== 1.1 iniciarBusca: roda no onload do busca.html ====
function iniciarBusca() {
  // Se veio do cabeçalho (busca.html?q=sushi), já coloco "sushi" no campo
  document.getElementById("q").value = pegarParametro("q");
  mostrarResultados();
}


// ======================================================================
// 2. BUSCA E FILTROS
// ======================================================================

// ==== 2.1 mostrarResultados ====
// Roda em vários eventos: oninput (digitando), onsearch (Enter) e onchange (filtros).
function mostrarResultados() {

  // ---- 2.1.1 ler o que a pessoa escolheu ----
  // toUpperCase deixa tudo MAIÚSCULO pra não diferenciar "Salmão" de "salmão"
  var termo = document.getElementById("q").value.toUpperCase();
  var precoMax = Number(document.getElementById("max").value);
  document.getElementById("max-lbl").innerHTML = dinheiro(precoMax);

  // ---- 2.1.2 ver quais categorias estão marcadas ----
  var escolhidas = [];
  var caixas = document.getElementsByName("cat");   // todos os checkbox com name="cat"
  for (var i = 0; i < caixas.length; i++) {
    if (caixas[i].checked) { escolhidas.push(caixas[i].value); }
  }

  // ---- 2.1.3 filtrar os produtos ----
  var lista = [];
  for (var j = 0; j < produtos.length; j++) {
    var p = produtos[j];
    var texto = (p.nome + " " + p.desc).toUpperCase();
    // indexOf != -1 quer dizer "achou o termo dentro do texto"
    var achouTexto = (termo == "" || texto.indexOf(termo) != -1);
    var achouCat = (escolhidas.length == 0 || escolhidas.indexOf(p.cat) != -1);
    // o produto só entra se passar nos 3 filtros: texto, categoria e preço
    if (achouTexto && achouCat && p.preco <= precoMax) {
      lista.push(p);
    }
  }
  lista = ordenarLista(lista, document.getElementById("ordem").value);

  // ---- 2.1.4 mostrar título e quantidade ----
  var titulo = "Todos os pratos";
  if (termo != "") { titulo = "Resultados para “" + document.getElementById("q").value + "”"; }
  document.getElementById("res-title").innerHTML = titulo;
  document.getElementById("res-count").innerHTML = lista.length + " prato(s) encontrado(s)";

  // ---- 2.1.5 mostrar os cards (ou aviso de "nada encontrado") ----
  if (lista.length == 0) {
    document.getElementById("grid").innerHTML = '<div class="card empty" style="grid-column:1/-1"><h3>Nada encontrado</h3><p>Tente outro termo ou limpe os filtros.</p></div>';
  } else {
    document.getElementById("grid").innerHTML = montarCards(lista);
  }
}


// ======================================================================
// 3. EVENTOS DOS FORMULÁRIOS
// ======================================================================

// ==== 3.1 enviarBusca: evento onsubmit do campo grande ====
function enviarBusca() {
  mostrarResultados();
  return false;                                  // false = não recarrega a página
}

// ==== 3.2 aoLimparFiltros: evento onreset do formulário de filtros ====
function aoLimparFiltros() {
  console.log("Filtros limpos");
  document.getElementById("q").value = "";
  // O onreset roda ANTES do navegador limpar os campos. Por isso espero 10 ms
  // com setTimeout e só depois mostro os resultados de novo.
  setTimeout(mostrarResultados, 10);
}
