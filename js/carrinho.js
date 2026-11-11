// ======================================================================
// RYŪMON  |  carrinho.js
// Página do carrinho: itens, cupom, totais e finalizar pedido.
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

// ==== 1.1 iniciarCarrinho: roda no onload do carrinho.html ====
function iniciarCarrinho() {
  // ---- 1.1.1 preencher o endereço com o do perfil (se a pessoa já salvou) ----
  var usuario = usuarioAtual();
  if (usuario != null && usuario[ENDERECO] != "") {
    var end = usuario[ENDERECO];
    if (usuario[NUMERO] != "") { end = end + ", " + usuario[NUMERO]; }
    document.getElementById("endereco").value = end.slice(0, 80);   // slice(0, 80) respeita o limite do campo
  }
  // ---- 1.1.2 lembrar do cupom que já estava aplicado ----
  var cupom = localStorage.getItem("cupom");
  if (cupom != null) { document.getElementById("cupom").value = cupom; }
  desenharCarrinho();
}


// ======================================================================
// 2. CÁLCULOS
// ======================================================================

// ==== 2.1 calcularDesconto: quanto o cupom desconta ====
function calcularDesconto(subtotal) {
  var cupom = localStorage.getItem("cupom");
  if (cupom == "RYUMON10") { return subtotal * 0.10; }               // 10% do subtotal
  if (cupom == "ARIGATO" && subtotal >= 80) { return 15; }           // R$ 15 se gastar 80 ou mais
  return 0;                                                          // sem cupom = sem desconto
}


// ======================================================================
// 3. DESENHAR O CARRINHO NA TELA
// ======================================================================

// ==== 3.1 desenharCarrinho: monta lista de itens + resumo do pedido ====
function desenharCarrinho() {
  var carrinho = pegarCarrinho();                // ex.: ["1","1","4"]

  // ---- 3.1.1 lista de produtos SEM repetir ----
  // O carrinho repete o id (1,1,4), mas na tela cada produto aparece 1 vez só
  // com a quantidade. Então crio a lista "unicos" = ["1","4"].
  var unicos = [];
  for (var i = 0; i < carrinho.length; i++) {
    if (unicos.indexOf(carrinho[i]) == -1) { unicos.push(carrinho[i]); }
  }
  unicos.sort(function (a, b) { return a - b; });   // deixa em ordem numérica

  // ---- 3.1.2 montar o HTML de cada item ----
  var html = "";
  var subtotal = 0;
  for (var j = 0; j < unicos.length; j++) {
    var id = unicos[j];
    var p = buscarProduto(id);
    var qtd = contarItem(id);
    subtotal = subtotal + p.preco * qtd;
    var classe = "tile xs";
    if (p.kanji.length > 2) { classe = "tile xs long"; }
    html = html + '<article class="card cart-item">';
    html = html + '<div class="' + classe + '">' + p.kanji + "</div>";
    html = html + '<div class="info"><h3>' + p.nome + "</h3><p>" + p.desc + "</p>";
    html = html + '<button class="link" onclick="removerItem(' + id + ')">Remover</button></div>';
    html = html + '<div class="stepper"><button onclick="menosUm(' + id + ')" aria-label="Diminuir">−</button><span>' + qtd + '</span><button onclick="maisUm(' + id + ')" aria-label="Aumentar">+</button></div>';
    html = html + '<div class="line-total">' + dinheiro(p.preco * qtd) + "</div></article>";
  }
  // ---- 3.1.3 carrinho vazio ----
  if (carrinho.length == 0) {
    html = '<div class="card empty"><h3>Seu carrinho está vazio</h3><p>Escolha seus pratos favoritos no cardápio.</p><p style="margin-top:18px"><a class="btn btn-gold" href="produtos.html">Ver cardápio</a></p></div>';
  }
  document.getElementById("cart-list").innerHTML = html;
  document.getElementById("cart-sub").innerHTML = carrinho.length + " item(ns) · revise antes de finalizar.";

  // ---- 3.1.4 calcular entrega, desconto e total ----
  var entrega = 0;
  if (subtotal > 0 && subtotal < 100) { entrega = 7.90; }            // frete grátis a partir de R$ 100
  var desconto = calcularDesconto(subtotal);
  // somarValores usa o "arguments" (ver site.js). O desconto entra NEGATIVO pra subtrair.
  var total = somarValores(subtotal, entrega, -desconto);

  // ---- 3.1.5 mostrar o resumo ----
  document.getElementById("r-sub").innerHTML = dinheiro(subtotal);
  if (entrega == 0 && subtotal > 0) {
    document.getElementById("r-delivery").innerHTML = "Grátis";
  } else {
    document.getElementById("r-delivery").innerHTML = dinheiro(entrega);
  }
  document.getElementById("r-disc-row").hidden = (desconto == 0);    // esconde a linha se não tem desconto
  document.getElementById("r-disc").innerHTML = "− " + dinheiro(desconto);
  document.getElementById("r-total").innerHTML = dinheiro(total);
  if (subtotal > 0 && subtotal < 100) {
    document.getElementById("free-note").innerHTML = "Faltam " + dinheiro(100 - subtotal) + " para a entrega grátis.";
  } else {
    document.getElementById("free-note").innerHTML = "";
  }
}


// ======================================================================
// 4. BOTÕES DOS ITENS
// ======================================================================

// ==== 4.1 maisUm: botão "+" ====
function maisUm(id) {
  var carrinho = pegarCarrinho();
  carrinho.push(String(id));
  salvarCarrinho(carrinho);
  desenharCarrinho();
}

// ==== 4.2 menosUm: botão "−" ====
function menosUm(id) {
  removerUmaUnidade(id);
  desenharCarrinho();
}

// ==== 4.3 removerItem: botão "Remover" ====
function removerItem(id) {
  removerTodasUnidades(id);
  desenharCarrinho();
}

// ==== 4.4 desfazerUltimo: botão "Desfazer última adição" ====
function desfazerUltimo() {
  var carrinho = pegarCarrinho();
  if (carrinho.length == 0) { window.alert("O carrinho já está vazio."); return; }
  // pop tira o ÚLTIMO item da lista e devolve ele
  var tirado = carrinho.pop();
  salvarCarrinho(carrinho);
  desenharCarrinho();
  aviso(buscarProduto(tirado).nome + " removido");
}


// ======================================================================
// 5. CUPOM
// ======================================================================

// ==== 5.1 aplicarCupom: botão "Aplicar" ====
function aplicarCupom() {
  var codigo = document.getElementById("cupom").value.toUpperCase();   // aceita minúscula também
  var msg = document.getElementById("coupon-msg");
  if (codigo == "RYUMON10") {
    localStorage.setItem("cupom", codigo);
    msg.innerHTML = "Cupom aplicado: 10% de desconto.";
  } else if (codigo == "ARIGATO") {
    localStorage.setItem("cupom", codigo);
    msg.innerHTML = "Cupom aplicado: R$ 15,00 de desconto (pedidos a partir de R$ 80).";
  } else {
    localStorage.removeItem("cupom");
    msg.innerHTML = "Cupom inválido.";
  }
  desenharCarrinho();                            // refaz os totais com o desconto
}


// ======================================================================
// 6. FINALIZAR PEDIDO
// ======================================================================

// ==== 6.1 finalizarPedido: botão "Finalizar pedido" ====
function finalizarPedido() {

  // ---- 6.1.1 conferir se pode finalizar ----
  var usuario = usuarioAtual();
  if (usuario == null) {
    window.alert("Entre na sua conta para finalizar o pedido.");
    window.location.href = "login.html?next=carrinho.html";   // depois do login volta pro carrinho
    return;
  }
  var carrinho = pegarCarrinho();
  if (carrinho.length == 0) {
    window.alert("Seu carrinho está vazio.");
    return;
  }
  var campoEndereco = document.getElementById("endereco");
  if (!validarCampo(campoEndereco, "endereco")) {
    campoEndereco.focus();
    return;
  }

  // ---- 6.1.2 forma de pagamento escolhida ----
  var pagto = "Pix";
  var radios = document.getElementsByName("pagto");
  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked) { pagto = radios[i].value; }
  }

  // ---- 6.1.3 montar os itens no formato "1:2;4:1" e somar o subtotal ----
  var unicos = [];
  for (var j = 0; j < carrinho.length; j++) {
    if (unicos.indexOf(carrinho[j]) == -1) { unicos.push(carrinho[j]); }
  }
  var itens = [];
  var subtotal = 0;
  for (var k = 0; k < unicos.length; k++) {
    var qtd = contarItem(unicos[k]);
    itens.push(unicos[k] + ":" + qtd);
    subtotal = subtotal + buscarProduto(unicos[k]).preco * qtd;
  }
  var entrega = 0;
  if (subtotal < 100) { entrega = 7.90; }
  var desconto = calcularDesconto(subtotal);
  var total = somarValores(subtotal, entrega, -desconto);

  // ---- 6.1.4 montar o registro do pedido ----
  // Faço um array com todos os dados e junto com join("|").
  // toFixed(2) deixa os números com 2 casas decimais.
  // new Date().getTime() = hora de agora em milissegundos (uso pra saber o status depois).
  var registro = [
    proximoNumeroPedido(), usuario[EMAIL], new Date().getTime(), itens.join(";"),
    subtotal.toFixed(2), entrega.toFixed(2), desconto.toFixed(2), total.toFixed(2),
    pagto, tirarSeparadores(campoEndereco.value), tirarSeparadores(document.getElementById("obs").value)
  ].join("|");

  // ---- 6.1.5 salvar ----
  var pedidos = listaPedidos();
  pedidos.push(registro);
  // Guardo no máximo 20 pedidos. Se passou, shift tira o PRIMEIRO (o mais antigo).
  if (pedidos.length > 20) { pedidos.shift(); }
  salvarPedidos(pedidos);

  // ---- 6.1.6 limpar o carrinho e avisar ----
  localStorage.removeItem("carrinho");
  localStorage.removeItem("cupom");
  console.log("Pedido salvo: " + registro);
  window.alert("Pedido realizado com sucesso! Itadakimasu!");
  window.location.href = "pedidos.html";
}
