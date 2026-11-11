// ======================================================================
// RYŪMON  |  login.js
// Página de login: confere e-mail e senha e guarda quem está logado.
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

// ==== 1.1 iniciarLogin: roda no onload do login.html ====
function iniciarLogin() {
  // Se a pessoa acabou de se cadastrar, o cadastro manda pra cá com ?cadastro=ok
  if (pegarParametro("cadastro") == "ok") {
    var msg = document.getElementById("msg");
    msg.innerHTML = "Conta criada! Entre para continuar.";
    msg.className = "form-msg show ok";          // className troca todas as classes do elemento
  }
}


// ======================================================================
// 2. LOGIN
// ======================================================================

// ==== 2.1 fazerLogin: evento onsubmit do formulário ====
function fazerLogin() {

  // ---- 2.1.1 validar os campos ----
  var certo = validarLista(["email", "senha"], ["email", "obrigatorio"]);
  if (!certo) { return false; }                  // return false = não envia o formulário

  // ---- 2.1.2 procurar o usuário ----
  var email = document.getElementById("email").value.toLowerCase();   // e-mail sempre minúsculo
  var senha = document.getElementById("senha").value;
  var posicao = indiceUsuario(email);
  var msg = document.getElementById("msg");

  // ---- 2.1.3 e-mail não existe OU senha errada ----
  // listaUsuarios()[posicao] é o registro do usuário; split("|")[SENHA] pega a senha dele
  if (posicao == -1 || listaUsuarios()[posicao].split("|")[SENHA] != senha) {
    msg.innerHTML = "E-mail ou senha incorretos.";
    msg.className = "form-msg show";
    window.alert("E-mail ou senha incorretos.");
    return false;
  }

  // ---- 2.1.4 login certo: guardar quem está logado ----
  sessionStorage.setItem("logado", email);       // vale até fechar o navegador
  if (document.getElementById("lembrar").checked) {
    localStorage.setItem("logado", email);       // "Lembrar de mim": continua logado
  }
  console.log("Login feito: " + email);

  // ---- 2.1.5 descobrir pra qual página ir depois do login ----
  // Só aceito páginas .html do próprio site (sem "/" nem ":") pra ninguém mandar o usuário pra outro site.
  var proximo = pegarParametro("next");
  if (proximo == "" || proximo.indexOf("/") != -1 || proximo.indexOf(":") != -1 || proximo.lastIndexOf(".html") != proximo.length - 5) {
    proximo = "index.html";
  }
  window.alert("Bem-vindo(a) de volta!");
  window.location.href = proximo;
  return false;
}


// ======================================================================
// 3. LIMPAR
// ======================================================================

// ==== 3.1 aoLimparLogin: evento onreset (botão "Limpar") ====
function aoLimparLogin() {
  limparErros(["email", "senha"]);
  document.getElementById("msg").className = "form-msg";
  return true;                                   // true = deixa o navegador limpar os campos
}
