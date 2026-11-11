// ======================================================================
// RYŪMON  |  pedidos.js
// Página "Meus pedidos": lista, filtros, detalhes e pedir de novo.
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

// Qual filtro está ativo: "todos", "andamento" ou "entregues"
var filtroAtual = "todos";


// ======================================================================
// 2. INÍCIO DA PÁGINA
// ======================================================================

// ==== 2.1 iniciarPedidos: roda no onload do pedidos.html ====
function iniciarPedidos() {
  var usuario = usuarioAtual();
  // ---- 2.1.1 sem login: mostra aviso pra entrar ----
  if (usuario == null) {
    document.getElementById("order-tabs").hidden = true;
    document.getElementById("orders").innerHTML = '<div class="card empty"><h3>Entre para ver seus pedidos</h3><p>Seus pedidos ficam salvos na sua conta.</p><p style="margin-top:18px"><a class="btn btn-gold" href="login.html?next=pedidos.html">Entrar</a></p></div>';
    return;
  }
  // ---- 2.1.2 com login: desenha a lista ----
  desenharPedidos();
}


// ======================================================================
// 3. STATUS E FILTROS
// ======================================================================

// ==== 3.1 statusDoPedido: o status muda conforme o tempo passa ====
// Fiz assim pra simular um pedido de verdade:
//   menos de 2 minutos = Em preparo | até 5 minutos = A caminho | depois = Entregue
function statusDoPedido(tempo) {
  // getTime() devolve a hora em milissegundos; divido por 60000 pra virar minutos
  var minutos = (new Date().getTime() - Number(tempo)) / 60000;
  if (minutos < 2) { return "Em preparo"; }
  if (minutos < 5) { return "A caminho"; }
  return "Entregue";
}

// ==== 3.2 filtrarPedidos: clique nos botões Todos / Em andamento / Entregues ====
function filtrarPedidos(filtro) {
  filtroAtual = filtro;
  var botoes = ["todos", "andamento", "entregues"];
  for (var i = 0; i < botoes.length; i++) {
    // setAttribute muda um atributo do HTML. aria-pressed="true" deixa o botão dourado.
    document.getElementById("tab-" + botoes[i]).setAttribute("aria-pressed", botoes[i] == filtro);
  }
  desenharPedidos();
}


// ======================================================================
// 4. DESENHAR OS PEDIDOS NA TELA
// ======================================================================

// ==== 4.1 desenharPedidos ====
function desenharPedidos() {
  var usuario = usuarioAtual();
  var todos = listaPedidos();

  // ---- 4.1.1 separar os pedidos DESTE usuário que passam no filtro ----
  var meus = [];
  var quantosTem = 0;                            // total de pedidos dele (sem filtro)
  for (var i = 0; i < todos.length; i++) {
    var c = todos[i].split("|");                 // separa os dados do pedido
    if (c[P_EMAIL] == usuario[EMAIL]) {
      quantosTem = quantosTem + 1;
      var s = statusDoPedido(c[P_TEMPO]);
      if (filtroAtual == "todos" || (filtroAtual == "andamento" && s != "Entregue") || (filtroAtual == "entregues" && s == "Entregue")) {
        meus.push(c);
      }
    }
  }
  // reverse inverte a lista. Como os pedidos novos ficam no final, assim o MAIS RECENTE aparece primeiro.
  meus.reverse();

  // ---- 4.1.2 casos sem pedido ----
  var caixa = document.getElementById("orders");
  if (quantosTem == 0) {
    caixa.innerHTML = '<div class="card empty"><h3>Você ainda não fez pedidos</h3><p>Que tal começar pelo cardápio?</p><p style="margin-top:18px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap"><a class="btn btn-gold" href="produtos.html">Ver cardápio</a><button class="btn btn-out" onclick="gerarExemplos()">Gerar pedidos de exemplo</button></p></div>';
    return;
  }
  if (meus.length == 0) {
    caixa.innerHTML = '<div class="card empty"><h3>Nenhum pedido aqui</h3><p>Não há pedidos nesta categoria.</p></div>';
    return;
  }

  // ---- 4.1.3 montar o HTML de cada pedido ----
  var html = "";
  for (var j = 0; j < meus.length; j++) {
    var p = meus[j];
    var status = statusDoPedido(p[P_TEMPO]);
    var classe = "";                             // classe CSS que muda a cor da etiqueta de status
    if (status == "Em preparo") { classe = "prep"; }
    if (status == "Entregue") { classe = "done"; }

    // itens vêm assim "1:2;4:1". Separo primeiro por ";" e depois cada um por ":"
    var itens = p[P_ITENS].split(";");           // ["1:2", "4:1"]
    var nomes = [];
    var linhas = "";
    for (var k = 0; k < itens.length; k++) {
      var par = itens[k].split(":");             // ["1", "2"] = [id, quantidade]
      var produto = buscarProduto(par[0]);
      nomes.push(produto.nome + " ×" + par[1]);
      linhas = linhas + "<li>" + par[1] + "× " + produto.nome + " — " + dinheiro(produto.preco * Number(par[1])) + "</li>";
    }
    var primeiro = buscarProduto(itens[0].split(":")[0]);   // o 1º produto dá o kanji do card
    var classeTile = "tile sm";
    if (primeiro.kanji.length > 2) { classeTile = "tile sm long"; }
    var numero = p[P_ID];
    var entrega = "Grátis";
    if (Number(p[P_ENTREGA]) > 0) { entrega = dinheiro(Number(p[P_ENTREGA])); }

    html = html + '<article class="card order"><div class="order-main">';
    html = html + '<div class="' + classeTile + '">' + primeiro.kanji + "</div>";
    // toLocaleString("pt-BR") escreve a data do jeito brasileiro
    html = html + '<div class="info"><h3>Pedido #' + numero + "</h3><small>" + new Date(Number(p[P_TEMPO])).toLocaleString("pt-BR") + "</small>";
    html = html + '<p class="items">' + nomes.join(" · ") + "</p></div>";   // join junta os nomes com " · "
    html = html + '<span class="status ' + classe + '">' + status + "</span>";
    html = html + '<div class="order-total"><small>Total</small><strong>' + dinheiro(Number(p[P_TOTAL])) + "</strong></div>";
    html = html + '<div class="order-actions"><button class="btn btn-out btn-sm" onclick="alternarDetalhes(' + numero + ')">Ver detalhes</button>';
    html = html + '<button class="btn btn-gold btn-sm" onclick="pedirNovamente(' + numero + ')">Pedir novamente</button></div></div>';
    html = html + '<div class="details" id="det-' + numero + '"><strong>Itens</strong><ul>' + linhas + "</ul>";
    html = html + "<p>Subtotal: " + dinheiro(Number(p[P_SUB])) + " · Entrega: " + entrega + " · Desconto: " + dinheiro(Number(p[P_DESC])) + "</p>";
    html = html + "<p>Pagamento: " + p[P_PAGTO] + " · Endereço: " + p[P_END] + "</p>";
    if (p[P_OBS] != "") { html = html + "<p>Obs.: " + p[P_OBS] + "</p>"; }
    html = html + "</div></article>";
  }
  caixa.innerHTML = html;
}


// ======================================================================
// 5. BOTÕES DOS PEDIDOS
// ======================================================================

// ==== 5.1 alternarDetalhes: botão "Ver detalhes" ====
function alternarDetalhes(numero) {
  // toggle abre se estiver fechado e fecha se estiver aberto
  document.getElementById("det-" + numero).classList.toggle("open");
}

// ==== 5.2 pedirNovamente: botão "Pedir novamente" ====
function pedirNovamente(numero) {
  var todos = listaPedidos();
  for (var i = 0; i < todos.length; i++) {
    var c = todos[i].split("|");
    if (c[P_ID] == numero) {
      // ---- 5.2.1 colocar os mesmos itens no carrinho ----
      var carrinho = pegarCarrinho();
      var itens = c[P_ITENS].split(";");
      for (var k = 0; k < itens.length; k++) {
        var par = itens[k].split(":");
        for (var q = 0; q < Number(par[1]); q++) { carrinho.push(par[0]); }   // repete conforme a quantidade
      }
      salvarCarrinho(carrinho);
      // ---- 5.2.2 ir pro carrinho ----
      window.alert("Itens do pedido #" + numero + " adicionados ao carrinho.");
      window.location.href = "carrinho.html";
    }
  }
}

// ==== 5.3 gerarExemplos: cria 3 pedidos antigos só pra testar a página ====
function gerarExemplos() {
  var usuario = usuarioAtual();
  var dia = 86400000;                            // quantos milissegundos tem 1 dia
  var agora = new Date().getTime();
  // cada exemplo: [itens, total, quantos dias atrás]
  var exemplos = [
    ["1:1;6:1;8:1", 97.70, 3],
    ["4:2;5:1", 129.70, 7],
    ["3:1;7:2", 82.70, 15]
  ];
  var pedidos = listaPedidos();
  for (var i = 0; i < exemplos.length; i++) {
    var reg = [proximoNumeroPedido(), usuario[EMAIL], agora - exemplos[i][2] * dia, exemplos[i][0],
      exemplos[i][1].toFixed(2), "0.00", "0.00", exemplos[i][1].toFixed(2), "Pix", "Endereço de exemplo, 123", ""].join("|");
    pedidos.push(reg);
  }
  salvarPedidos(pedidos);
  desenharPedidos();
}


// ======================================================================
// 6. EXPORTAR PEDIDOS PARA O SISTEMA EM C# (arquivo JSON)
// ======================================================================
// O sistema da loja (C#) lê um arquivo pedidos.json. Aqui eu transformo os
// pedidos que estão no localStorage nesse formato e baixo o arquivo.
// Atenção: a SENHA e o CPF do cliente NÃO vão pro arquivo.

// ==== 6.1 doisDigitos: 5 vira "05" (pra data e hora ficarem certinhas) ====
function doisDigitos(n) {
  if (n < 10) { return "0" + n; }
  return "" + n;
}

// ==== 6.2 dataParaTexto: milissegundos viram "2026-11-10 14:30:00" ====
function dataParaTexto(tempo) {
  var d = new Date(Number(tempo));
  return d.getFullYear() + "-" + doisDigitos(d.getMonth() + 1) + "-" + doisDigitos(d.getDate()) + " " +
         doisDigitos(d.getHours()) + ":" + doisDigitos(d.getMinutes()) + ":" + doisDigitos(d.getSeconds());
}

// ==== 6.3 exportarPedidosJson: botão "Baixar pedidos.json" ====
function exportarPedidosJson() {
  var todos = listaPedidos();
  if (todos.length == 0) {
    window.alert("Não há pedidos para exportar.");
    return;
  }

  var lista = [];                                // lista de objetos, um por pedido
  for (var i = 0; i < todos.length; i++) {
    var c = todos[i].split("|");                 // separa os dados do pedido

    // ---- 6.3.1 dados do cliente (vêm do cadastro, pelo e-mail do pedido) ----
    var cliente = { nome: "", email: c[P_EMAIL], telefone: "", cep: "" };
    var posicao = indiceUsuario(c[P_EMAIL]);
    if (posicao != -1) {
      var u = listaUsuarios()[posicao].split("|");
      cliente.nome = u[NOME];
      cliente.telefone = u[TEL];
      cliente.cep = u[CEP];
    }

    // ---- 6.3.2 itens: "1:2;4:1" vira [{produtoId:1, quantidade:2}, {produtoId:4, quantidade:1}] ----
    var itens = [];
    var pares = c[P_ITENS].split(";");
    for (var k = 0; k < pares.length; k++) {
      var par = pares[k].split(":");
      itens.push({ produtoId: Number(par[0]), quantidade: Number(par[1]) });
    }

    // ---- 6.3.3 o pedido completo ----
    lista.push({
      id: Number(c[P_ID]),
      dataHora: dataParaTexto(c[P_TEMPO]),
      pagamento: c[P_PAGTO],
      observacao: c[P_OBS] || "",
      subtotal: Number(c[P_SUB]),
      entrega: Number(c[P_ENTREGA]),
      desconto: Number(c[P_DESC]),
      total: Number(c[P_TOTAL]),
      enderecoEntrega: c[P_END],
      cliente: cliente,
      itens: itens
    });
  }

  // ---- 6.3.4 virar texto JSON e baixar ----
  // JSON.stringify transforma os objetos em texto JSON (o 2 deixa o arquivo bonito, com recuo).
  var texto = JSON.stringify({ pedidos: lista }, null, 2);
  var link = document.createElement("a");        // cria um <a> invisível só pra baixar
  link.href = "data:application/json;charset=utf-8," + encodeURIComponent(texto);
  link.download = "pedidos.json";                // nome do arquivo baixado
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  console.log("Exportados " + lista.length + " pedido(s).");
}

