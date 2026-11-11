// ======================================================================
// RYŪMON  |  cadastro.js
// Página de cadastro: valida tudo e salva o usuário novo.
// ----------------------------------------------------------------------
// COMO LER OS COMENTÁRIOS (pra quem for ler meu código):
//   // ====== 1. TÍTULO ======   -> nível 1 (parte grande do arquivo)
//   // ==== 1.1 Título ====      -> nível 2 (subparte)
//   // ---- 1.1.1 título ----    -> nível 3 (detalhe pequeno)
//   // texto normal             -> explicação do que eu fiz, em português
// ======================================================================


// ======================================================================
// 1. VARIÁVEIS DA PÁGINA
// ======================================================================

// Os campos do formulário e o tipo de validação de cada um (mesma ordem nos 2 arrays)
var idsCadastro = ["nome", "cpf", "tel", "cep", "nasc", "email", "senha", "senha2"];
var tiposCadastro = ["nome", "cpf", "tel", "cep", "data", "email", "senha", "obrigatorio"];


// ======================================================================
// 2. CADASTRAR
// ======================================================================

// ==== 2.1 cadastrar: evento onsubmit do formulário ====
function cadastrar() {

  // ---- 2.1.1 validar todos os campos ----
  var certo = validarLista(idsCadastro, tiposCadastro);
  if (!certo) { return false; }

  // ---- 2.1.2 conferir se as duas senhas são iguais ----
  var senha = document.getElementById("senha").value;
  if (senha != document.getElementById("senha2").value) {
    document.getElementById("erro-senha2").innerHTML = "As senhas não conferem.";
    document.getElementById("senha2").classList.add("invalid");
    document.getElementById("senha2").focus();
    return false;
  }

  // ---- 2.1.3 conferir se aceitou os termos ----
  if (!document.getElementById("termos").checked) {
    window.alert("Aceite os termos de uso para continuar.");
    return false;
  }

  var nome = document.getElementById("nome").value;
  var cpf = document.getElementById("cpf").value;
  var email = document.getElementById("email").value.toLowerCase();

  // ---- 2.1.4 não pode repetir e-mail nem CPF ----
  var lista = listaUsuarios();
  for (var i = 0; i < lista.length; i++) {
    var c = lista[i].split("|");
    if (c[EMAIL] == email) {
      document.getElementById("erro-email").innerHTML = "Este e-mail já está cadastrado.";
      document.getElementById("email").focus();
      return false;
    }
    if (c[CPF] == cpf) {
      document.getElementById("erro-cpf").innerHTML = "Este CPF já está cadastrado.";
      document.getElementById("cpf").focus();
      return false;
    }
  }

  // ---- 2.1.5 montar o registro do usuário ----
  // Ordem: nome|email|cpf|tel|nascimento|cep|numero|endereco|complemento|senha
  // (numero, endereco e complemento começam vazios; a pessoa preenche depois no perfil)
  // OBS: a senha fica guardada em texto puro porque é projeto escolar. Num site de
  // verdade ela seria criptografada lá no servidor.
  var registro = [
    nome, email, cpf, document.getElementById("tel").value, document.getElementById("nasc").value,
    document.getElementById("cep").value, "", "", "", senha
  ].join("|");

  // ---- 2.1.6 salvar e ir pro login ----
  lista.push(registro);
  salvarUsuarios(lista);
  console.log("Usuário cadastrado: " + email);
  window.alert("Conta criada com sucesso! Agora faça o login.");
  window.location.href = "login.html?cadastro=ok";
  return false;
}


// ======================================================================
// 3. LIMPAR
// ======================================================================

// ==== 3.1 aoLimparCadastro: evento onreset (botão "Limpar") ====
function aoLimparCadastro() {
  limparErros(idsCadastro);                      // apaga as mensagens vermelhas
  window.alert("Formulário limpo.");
  return true;
}
