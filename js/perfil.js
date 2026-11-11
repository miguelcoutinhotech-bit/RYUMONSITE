// ======================================================================
// RYŪMON  |  perfil.js
// Página de perfil: ver, editar e excluir a conta (o CRUD do usuário).
// ----------------------------------------------------------------------
// COMO LER OS COMENTÁRIOS (pra quem for ler meu código):
//   // ====== 1. TÍTULO ======   -> nível 1 (parte grande do arquivo)
//   // ==== 1.1 Título ====      -> nível 2 (subparte)
//   // ---- 1.1.1 título ----    -> nível 3 (detalhe pequeno)
//   // texto normal             -> explicação do que eu fiz, em português
// ======================================================================

// CRUD = Create (cadastro.js), Read (mostrar os dados aqui), Update (salvar alterações)
// e Delete (excluir conta).

// ======================================================================
// 1. INÍCIO DA PÁGINA
// ======================================================================

// ==== 1.1 iniciarPerfil: roda no onload do perfil.html ====
function iniciarPerfil() {
  var usuario = usuarioAtual();
  // ---- 1.1.1 sem login: mostra o aviso e esconde o perfil ----
  if (usuario == null) {
    document.getElementById("profile-wrap").hidden = true;    // hidden = esconde o elemento
    document.getElementById("profile-gate").hidden = false;
    return;
  }
  // ---- 1.1.2 com login: mostra o perfil preenchido ----
  document.getElementById("profile-gate").hidden = true;
  document.getElementById("profile-wrap").hidden = false;
  preencherPerfil(usuario);
  marcarBotoesTema();
}

// ==== 1.2 preencherPerfil: coloca os dados do usuário nos campos (o "Read" do CRUD) ====
function preencherPerfil(u) {
  document.getElementById("p-name").innerHTML = u[NOME];
  document.getElementById("p-email").innerHTML = u[EMAIL];
  document.getElementById("f-nome").value = u[NOME];
  document.getElementById("f-email").value = u[EMAIL];
  document.getElementById("f-nasc").value = u[NASC];
  document.getElementById("f-cpf").value = u[CPF];
  document.getElementById("f-tel").value = u[TEL];
  document.getElementById("f-cep").value = u[CEP];
  document.getElementById("f-num").value = u[NUMERO];
  document.getElementById("f-end").value = u[ENDERECO];
  document.getElementById("f-comp").value = u[COMPL];
}


// ======================================================================
// 2. MENU LATERAL (troca de painel)
// ======================================================================

// ==== 2.1 mostrarPainel: clique em "Dados pessoais", "Endereço" ou "Aparência" ====
function mostrarPainel(nome) {
  var nomes = ["dados", "end", "tema"];
  for (var i = 0; i < nomes.length; i++) {
    var painel = document.getElementById("panel-" + nomes[i]);
    var botao = document.getElementById("menu-" + nomes[i]);
    if (nomes[i] == nome) {
      painel.className = "card panel active";    // "active" faz o painel aparecer
      botao.className = "active";
    } else {
      painel.className = "card panel";
      botao.className = "";
    }
  }
}


// ======================================================================
// 3. SALVAR ALTERAÇÕES (o "Update" do CRUD)
// ======================================================================

// ==== 3.1 atualizarUsuario: troca dados do usuário logado ====
// posicoes = quais dados mudar (ex.: [TEL])   valores = os novos valores (ex.: ["(11) 9..."])
function atualizarUsuario(posicoes, valores) {
  var usuario = usuarioAtual();
  var emailAntigo = usuario[EMAIL];
  var posicao = indiceUsuario(emailAntigo);

  // ---- 3.1.1 fazer o registro novo ----
  var novo = usuario.concat();                   // concat() sem nada = cópia do array
  for (var i = 0; i < posicoes.length; i++) {
    novo[posicoes[i]] = tirarSeparadores(valores[i]);
  }

  // ---- 3.1.2 trocar o registro antigo pelo novo na lista ----
  var lista = listaUsuarios();
  // splice(posição, 1, novoItem) remove 1 item dali e coloca o novo no lugar
  lista.splice(posicao, 1, novo.join("|"));
  salvarUsuarios(lista);

  // ---- 3.1.3 se o e-mail mudou, atualizar o login e os pedidos ----
  // (o e-mail é como o site reconhece o usuário, então tudo que usa ele precisa mudar)
  if (novo[EMAIL] != emailAntigo) {
    if (sessionStorage.getItem("logado") == emailAntigo) { sessionStorage.setItem("logado", novo[EMAIL]); }
    if (localStorage.getItem("logado") == emailAntigo) { localStorage.setItem("logado", novo[EMAIL]); }
    var pedidos = listaPedidos();
    for (var j = 0; j < pedidos.length; j++) {
      var c = pedidos[j].split("|");
      if (c[P_EMAIL] == emailAntigo) { c[P_EMAIL] = novo[EMAIL]; pedidos[j] = c.join("|"); }
    }
    salvarPedidos(pedidos);
  }
  preencherPerfil(novo);
  montarAreaLogin();                             // atualiza o "Olá, Fulano" do cabeçalho
}

// ==== 3.2 salvarDados: evento onsubmit do formulário "Dados pessoais" ====
function salvarDados() {
  // ---- 3.2.1 validar ----
  var certo = validarLista(["f-nome", "f-email", "f-nasc", "f-cpf", "f-tel"], ["nome", "email", "data", "cpf", "tel"]);
  if (!certo) { return false; }

  // ---- 3.2.2 e-mail e CPF não podem ser de OUTRA conta ----
  var email = document.getElementById("f-email").value.toLowerCase();
  var cpf = document.getElementById("f-cpf").value;
  var meuEmail = usuarioAtual()[EMAIL];
  var lista = listaUsuarios();
  for (var i = 0; i < lista.length; i++) {
    var c = lista[i].split("|");
    if (c[EMAIL] != meuEmail && c[EMAIL] == email) {
      document.getElementById("erro-f-email").innerHTML = "E-mail já usado por outra conta.";
      return false;
    }
    if (c[EMAIL] != meuEmail && c[CPF] == cpf) {
      document.getElementById("erro-f-cpf").innerHTML = "CPF já usado por outra conta.";
      return false;
    }
  }

  // ---- 3.2.3 salvar ----
  atualizarUsuario([NOME, EMAIL, NASC, CPF, TEL],
    [document.getElementById("f-nome").value, email, document.getElementById("f-nasc").value, cpf, document.getElementById("f-tel").value]);
  window.alert("Dados salvos com sucesso!");
  return false;
}

// ==== 3.3 salvarEndereco: evento onsubmit do formulário "Endereço" ====
function salvarEndereco() {
  var certo = validarLista(["f-cep", "f-num", "f-end"], ["cep", "numero", "endereco"]);
  if (!certo) { return false; }
  atualizarUsuario([CEP, NUMERO, ENDERECO, COMPL],
    [document.getElementById("f-cep").value, document.getElementById("f-num").value, document.getElementById("f-end").value, document.getElementById("f-comp").value]);
  window.alert("Endereço salvo com sucesso!");
  return false;
}

// ==== 3.4 aoDescartar: evento onreset (botão "Descartar") ====
function aoDescartar() {
  limparErros(["f-nome", "f-email", "f-nasc", "f-cpf", "f-tel", "f-cep", "f-num", "f-end"]);
  // O onreset roda antes do navegador limpar. Espero 10 ms e preencho de novo
  // com o que está salvo (senão os campos ficariam vazios).
  setTimeout(function () { preencherPerfil(usuarioAtual()); }, 10);
  return true;
}


// ======================================================================
// 4. APARÊNCIA (tema)
// ======================================================================

// ==== 4.1 marcarBotoesTema: deixa dourado o botão do tema que está ativo ====
function marcarBotoesTema() {
  var escuro = document.documentElement.classList.contains("darkmode");
  document.getElementById("btn-claro").setAttribute("aria-pressed", !escuro);
  document.getElementById("btn-escuro").setAttribute("aria-pressed", escuro);
}


// ======================================================================
// 5. EXCLUIR CONTA (o "Delete" do CRUD)
// ======================================================================

// ==== 5.1 excluirConta: botão "Excluir conta" ====
function excluirConta() {
  // confirm abre uma caixinha com OK e Cancelar (parecido com o alert)
  if (!window.confirm("Excluir sua conta e todos os seus pedidos? Isso não pode ser desfeito.")) { return; }
  var email = usuarioAtual()[EMAIL];

  // ---- 5.1.1 tirar o usuário da lista ----
  var lista = listaUsuarios();
  lista.splice(indiceUsuario(email), 1);         // splice(posição, 1) remove 1 item
  salvarUsuarios(lista);

  // ---- 5.1.2 apagar os pedidos dele (guardo só os dos outros) ----
  var restantes = [];
  var pedidos = listaPedidos();
  for (var i = 0; i < pedidos.length; i++) {
    if (pedidos[i].split("|")[P_EMAIL] != email) { restantes.push(pedidos[i]); }
  }
  salvarPedidos(restantes);

  // ---- 5.1.3 deslogar e voltar pra página inicial ----
  sessionStorage.removeItem("logado");
  localStorage.removeItem("logado");
  window.alert("Conta excluída.");
  window.location.href = "index.html";
}
