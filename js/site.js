// ======================================================================
// RYŪMON  |  site.js
// Funções que TODAS as páginas usam: tema, carrinho, usuários, cabeçalho.
// ----------------------------------------------------------------------
// COMO LER OS COMENTÁRIOS (pra quem for ler meu código):
//   // ====== 1. TÍTULO ======   -> nível 1 (parte grande do arquivo)
//   // ==== 1.1 Título ====      -> nível 2 (subparte)
//   // ---- 1.1.1 título ----    -> nível 3 (detalhe pequeno)
//   // texto normal             -> explicação do que eu fiz, em português
// ----------------------------------------------------------------------
// IDEIA PRINCIPAL DESSE ARQUIVO (vale ler antes de ver o resto):
//   localStorage   = guarda os dados MESMO fechando o navegador
//   sessionStorage = guarda só até fechar a aba/navegador
//   O storage só guarda TEXTO. Então pra guardar uma lista eu junto tudo
//   num texto só com join() e, pra ler, separo de novo com split():
//     carrinho  -> "1,1,4"   (cada número = 1 unidade daquele produto)
//     usuários  -> "registro#registro#registro" (campos separados por "|")
//     pedidos   -> mesma ideia dos usuários
// ======================================================================


// ======================================================================
// 1. TEMA CLARO / ESCURO
// ======================================================================
// O modo básico do site é o CLARO. O escuro é a classe "darkmode" colocada
// no <html>. O CSS enxerga essa classe e troca as cores (e o dragão).

// ==== 1.1 trocarTema: botão do cabeçalho ====
function trocarTema() {
  var html = document.documentElement;           // documentElement = a tag <html>
  if (html.classList.contains("darkmode")) {
    // ---- 1.1.1 estava escuro -> volta pro claro ----
    html.classList.remove("darkmode");
    localStorage.setItem("tema", "claro");       // salvo a escolha pra lembrar depois
  } else {
    // ---- 1.1.2 estava claro -> vai pro escuro ----
    html.classList.add("darkmode");
    localStorage.setItem("tema", "escuro");
  }
  console.log("Tema salvo: " + localStorage.getItem("tema"));
}

// ==== 1.2 setarTema: botões Claro/Escuro da página de perfil ====
function setarTema(nome) {
  if (nome == "escuro") {
    document.documentElement.classList.add("darkmode");
  } else {
    document.documentElement.classList.remove("darkmode");
  }
  localStorage.setItem("tema", nome);
  // marcarBotoesTema só existe no perfil.js. O typeof confere se ela existe
  // nessa página antes de chamar (senão dava erro nas outras páginas).
  if (typeof marcarBotoesTema == "function") { marcarBotoesTema(); }
}


// ======================================================================
// 2. PEQUENAS UTILIDADES
// ======================================================================

// ==== 2.1 dinheiro: transforma 54.9 em "R$ 54,90" ====
function dinheiro(valor) {
  var texto = valor.toFixed(2);                  // toFixed(2) = sempre 2 casas: "54.90"
  texto = texto.replace(".", ",");               // replace troca o ponto pela vírgula
  return "R$ ".concat(texto);                    // concat junta dois textos
}

// ==== 2.2 somarValores: soma QUANTOS números eu mandar ====
// Aqui eu uso o objeto "arguments": ele guarda todos os valores que foram
// passados na chamada, mesmo sem eu declarar parâmetros.
// Ex.: somarValores(10, 5, -2)  ->  13
function somarValores() {
  var soma = 0;
  for (var i = 0; i < arguments.length; i++) {
    soma = soma + arguments[i];
  }
  return soma;
}

// ==== 2.3 pegarParametro: lê um dado que veio na URL ====
// Ex.: se o endereço é busca.html?q=sushi, então pegarParametro("q") devolve "sushi".
function pegarParametro(nome) {
  var busca = window.location.search;            // pega a parte "?q=sushi&x=1"
  if (busca.length < 2) { return ""; }           // não veio nada
  // ---- 2.3.1 separar os pares ----
  var pares = busca.substring(1).split("&");     // tira o "?" e corta nos "&"
  for (var i = 0; i < pares.length; i++) {
    // ---- 2.3.2 separar nome e valor ----
    var par = pares[i].split("=");               // ["q", "sushi"]
    if (par[0] == nome && par.length > 1) {
      var valor = par[1].split("+").join(" ");   // "+" na URL significa espaço
      return decodeURIComponent(valor);          // desfaz códigos tipo %C3%A7 (= ç)
    }
  }
  return "";
}

// ==== 2.4 aviso: mensagem rápida que some sozinha ====
function aviso(texto) {
  var caixa = document.getElementById("aviso");  // a <div id="aviso"> fica no fim de cada página
  caixa.innerHTML = texto;
  caixa.classList.add("show");                   // a classe "show" faz ela aparecer (CSS)
  // setTimeout executa a função depois de 2500 milissegundos (2,5 segundos)
  setTimeout(function () { caixa.classList.remove("show"); }, 2500);
}


// ======================================================================
// 3. PRODUTOS (usa a lista do dados.js)
// ======================================================================

// ==== 3.1 buscarProduto: acha um produto pelo id ====
function buscarProduto(id) {
  for (var i = 0; i < produtos.length; i++) {
    if (produtos[i].id == id) { return produtos[i]; }   // "==" (e não "===") porque o id às vezes vem como texto
  }
  return null;
}

// ==== 3.2 montarCards: monta o HTML dos cards de uma lista ====
// Recebe uma lista de produtos e devolve um texto cheio de HTML.
// Depois a página joga esse texto dentro de uma <div> com innerHTML.
function montarCards(lista) {
  var html = "";
  for (var i = 0; i < lista.length; i++) {
    var p = lista[i];
    var classe = "tile";
    if (p.kanji.length > 2) { classe = "tile long"; }   // kanji grande demais fica menor
    // concat junta um texto no outro (igual ao "+")
    html = html.concat('<article class="card prod">');
    html = html.concat('<div class="' + classe + '">' + p.kanji + '</div>');
    html = html.concat("<h3>" + p.nome + "</h3><p>" + p.desc + "</p>");
    html = html.concat('<div class="prod-foot"><span class="price">' + dinheiro(p.preco) + "</span>");
    html = html.concat('<button class="add" onclick="adicionarAoCarrinho(' + p.id + ')" aria-label="Adicionar ao carrinho">+</button></div>');
    html = html.concat("</article>");
  }
  return html;
}

// ==== 3.3 ordenarLista: ordena os produtos (usa sort) ====
// criterio pode ser: "menor", "maior", "az" ou qualquer outro (= mais pedidos)
function ordenarLista(lista, criterio) {
  // sort recebe uma função que compara 2 itens (a e b):
  //   número negativo = a vem antes | positivo = b vem antes | 0 = empate
  if (criterio == "menor") {
    lista.sort(function (a, b) { return a.preco - b.preco; });
  } else if (criterio == "maior") {
    lista.sort(function (a, b) { return b.preco - a.preco; });
  } else if (criterio == "az") {
    lista.sort(function (a, b) {
      if (a.nome < b.nome) { return -1; }
      if (a.nome > b.nome) { return 1; }
      return 0;
    });
  } else {
    lista.sort(function (a, b) { return a.pop - b.pop; });   // mais pedidos
  }
  return lista;
}


// ======================================================================
// 4. CARRINHO (guardado no localStorage)
// ======================================================================
// O carrinho é um texto tipo "1,1,4" -> produto 1 duas vezes e produto 4 uma vez.

// ==== 4.1 ler e salvar ====

// ---- 4.1.1 pegarCarrinho: texto -> array ----
function pegarCarrinho() {
  var texto = localStorage.getItem("carrinho");  // ex.: "1,1,4"
  if (texto == null || texto == "") { return []; }   // sem nada guardado = lista vazia
  return texto.split(",");                       // vira ["1", "1", "4"]
}

// ---- 4.1.2 salvarCarrinho: array -> texto ----
function salvarCarrinho(lista) {
  // toString transforma ["1","1","4"] em "1,1,4"
  localStorage.setItem("carrinho", lista.toString());
  atualizarContador();                           // atualiza o numerinho do cabeçalho
}

// ==== 4.2 adicionar e remover ====

// ---- 4.2.1 adicionarAoCarrinho: botão "+" dos cards ----
function adicionarAoCarrinho(id) {
  var carrinho = pegarCarrinho();
  carrinho.push(String(id));                     // push coloca no FINAL da lista
  salvarCarrinho(carrinho);
  aviso(buscarProduto(id).nome + " adicionado ao carrinho");
  console.log("Carrinho: " + carrinho.toString());
}

// ---- 4.2.2 contarItem: quantas unidades de um produto tem ----
function contarItem(id) {
  var carrinho = pegarCarrinho();
  var quantidade = 0;
  for (var i = 0; i < carrinho.length; i++) {
    if (carrinho[i] == id) { quantidade = quantidade + 1; }
  }
  return quantidade;
}

// ---- 4.2.3 removerUmaUnidade: botão "−" ----
function removerUmaUnidade(id) {
  var carrinho = pegarCarrinho();
  var posicao = carrinho.indexOf(String(id));    // acha a 1ª posição do produto
  if (posicao != -1) {
    carrinho.splice(posicao, 1);                 // splice(posição, 1) remove 1 item dali
  }
  salvarCarrinho(carrinho);
}

// ---- 4.2.4 removerTodasUnidades: botão "Remover" ----
function removerTodasUnidades(id) {
  var carrinho = pegarCarrinho();
  var novo = [];
  for (var i = 0; i < carrinho.length; i++) {
    if (carrinho[i] != id) { novo.push(carrinho[i]); }   // só guardo os que NÃO são o produto
  }
  salvarCarrinho(novo);
}

// ==== 4.3 atualizarContador: o numerinho do "Carrinho" no cabeçalho ====
function atualizarContador() {
  var total = pegarCarrinho().length;
  // getElementsByClassName devolve VÁRIOS elementos, por isso o for
  var contadores = document.getElementsByClassName("cart-count");
  for (var i = 0; i < contadores.length; i++) {
    contadores[i].innerHTML = total;
  }
}


// ======================================================================
// 5. USUÁRIOS E LOGIN
// ======================================================================
// Cada usuário é um texto com os dados separados por "|":
//   nome|email|cpf|tel|nascimento|cep|numero|endereco|complemento|senha
// E a lista de usuários junta todos separados por "#".

// ==== 5.1 posição de cada dado dentro do registro ====
// Assim eu escrevo usuario[EMAIL] em vez de usuario[1] (fica mais fácil de entender)
var NOME = 0, EMAIL = 1, CPF = 2, TEL = 3, NASC = 4, CEP = 5, NUMERO = 6, ENDERECO = 7, COMPL = 8, SENHA = 9;

// ==== 5.2 ler e salvar a lista de usuários ====
function listaUsuarios() {
  var texto = localStorage.getItem("usuarios");
  if (texto == null || texto == "") { return []; }
  return texto.split("#");                       // cada item é o registro de 1 usuário
}

function salvarUsuarios(lista) {
  localStorage.setItem("usuarios", lista.join("#"));   // join cola tudo separando por #
}

// ==== 5.3 indiceUsuario: em que posição da lista está esse e-mail? (-1 = não achou) ====
function indiceUsuario(email) {
  var lista = listaUsuarios();
  for (var i = 0; i < lista.length; i++) {
    var campos = lista[i].split("|");            // separa os dados do usuário
    if (campos[EMAIL] == email) { return i; }
  }
  return -1;
}

// ==== 5.4 usuarioAtual: devolve os dados de quem está logado (ou null) ====
function usuarioAtual() {
  // ---- 5.4.1 descobrir quem está logado ----
  // sessionStorage = login "normal" (some quando fecha o navegador)
  // localStorage   = login do "Lembrar de mim" (continua depois de fechar)
  var email = sessionStorage.getItem("logado");
  if (email == null) {
    email = localStorage.getItem("logado");
  }
  if (email == null) { return null; }
  // ---- 5.4.2 buscar os dados desse e-mail ----
  var posicao = indiceUsuario(email);
  if (posicao == -1) { return null; }
  return listaUsuarios()[posicao].split("|");
}

// ==== 5.5 sair: botão "Sair" ====
function sair() {
  sessionStorage.removeItem("logado");           // removeItem apaga aquele dado
  localStorage.removeItem("logado");
  window.alert("Você saiu da conta.");
  window.location.href = "index.html";           // href muda a página
}


// ======================================================================
// 6. CABEÇALHO (parte que muda conforme o usuário)
// ======================================================================

// ==== 6.1 montarAreaLogin: mostra "Entrar/Cadastrar" ou "Olá, Fulano" ====
function montarAreaLogin() {
  var area = document.getElementById("auth-area");
  var usuario = usuarioAtual();
  if (usuario == null) {
    // ---- 6.1.1 ninguém logado ----
    area.innerHTML = '<a class="btn btn-out btn-sm" href="login.html">Entrar</a><a class="btn btn-gold btn-sm" href="cadastro.html">Cadastrar</a>';
  } else {
    // ---- 6.1.2 alguém logado: mostra o primeiro nome ----
    var primeiroNome = usuario[NOME].split(" ")[0];    // "Ana Silva" -> ["Ana","Silva"] -> "Ana"
    area.innerHTML = '<a class="btn btn-out btn-sm" href="perfil.html">Olá, ' + primeiroNome + '</a><button class="btn btn-gold btn-sm" onclick="sair()">Sair</button>';
  }
}

// ==== 6.2 abrirMenu: botão ☰ do celular ====
function abrirMenu() {
  // toggle = se tem a classe tira, se não tem coloca
  document.getElementById("nav-panel").classList.toggle("open");
}

// ==== 6.3 avisoLogo: evento oncontextmenu (clique com o botão DIREITO) ====
function avisoLogo() {
  window.alert("Esta é a logo do RYŪMON: a carpa koi, símbolo de força e boa sorte.");
  return false;                                  // return false cancela o menu do botão direito
}

// ==== 6.4 busca do cabeçalho ====

// ---- 6.4.1 enviarBuscaTopo: evento onsubmit ----
function enviarBuscaTopo() {
  var termo = document.getElementById("busca-topo").value;
  if (termo.length == 0) {
    window.alert("Digite algo para buscar.");
    return false;                                // return false = NÃO envia o formulário
  }
  return true;                                   // true = deixa ir pra busca.html
}

// ---- 6.4.2 aoPesquisar: evento onsearch (Enter no campo type="search") ----
function aoPesquisar(campo) {
  console.log("Pesquisou por: " + campo.value);
}


// ======================================================================
// 7. PEDIDOS (guardados no localStorage)
// ======================================================================
// Mesmo esquema dos usuários. Cada pedido é um texto com os dados separados por "|":
//   id|email|tempo|itens|subtotal|entrega|desconto|total|pagamento|endereco|obs
// Os itens ficam assim: "1:2;4:1" -> produto 1 (x2) e produto 4 (x1).

// ==== 7.1 posição de cada dado do pedido ====
var P_ID = 0, P_EMAIL = 1, P_TEMPO = 2, P_ITENS = 3, P_SUB = 4, P_ENTREGA = 5, P_DESC = 6, P_TOTAL = 7, P_PAGTO = 8, P_END = 9, P_OBS = 10;

// ==== 7.2 ler e salvar a lista de pedidos ====
function listaPedidos() {
  var texto = localStorage.getItem("pedidos");
  if (texto == null || texto == "") { return []; }
  return texto.split("#");
}

function salvarPedidos(lista) {
  localStorage.setItem("pedidos", lista.join("#"));
}

// ==== 7.3 proximoNumeroPedido: gera o número do pedido (#482, #483...) ====
function proximoNumeroPedido() {
  var numero = Number(localStorage.getItem("ultimoPedido"));
  if (numero < 481) { numero = 481; }            // o primeiro pedido vai ser o 482
  numero = numero + 1;
  localStorage.setItem("ultimoPedido", numero);
  return numero;
}


// ======================================================================
// 8. INÍCIO DA PÁGINA
// ======================================================================

// ==== 8.1 iniciarPagina: roda quando a página termina de carregar ====
// No HTML: <body onload="iniciarPagina(); ...">
function iniciarPagina() {
  atualizarContador();
  montarAreaLogin();
  console.log("Página carregada: " + window.location.pathname);
}
