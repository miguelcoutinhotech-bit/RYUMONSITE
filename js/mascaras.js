// ======================================================================
// RYŪMON  |  mascaras.js
// Máscaras dos campos, limitação de caracteres e validações.
// É aqui que os campos de CPF, telefone, CEP e data ganham a formatação
// automática (000.000.000-00 etc.) e que os campos de número só aceitam número.
// ----------------------------------------------------------------------
// COMO LER OS COMENTÁRIOS (pra quem for ler meu código):
//   // ====== 1. TÍTULO ======   -> nível 1 (parte grande do arquivo)
//   // ==== 1.1 Título ====      -> nível 2 (subparte)
//   // ---- 1.1.1 título ----    -> nível 3 (detalhe pequeno)
//   // texto normal             -> explicação do que eu fiz, em português
// ----------------------------------------------------------------------
// MÉTODOS DE STRING que eu usei aqui (os da aula):
//   valueOf, charAt, concat, indexOf, lastIndexOf, replace, search,
//   slice, split, substring, toUpperCase e length
// ======================================================================


// ======================================================================
// 1. FUNÇÕES AUXILIARES (as outras funções usam elas)
// ======================================================================

// ==== 1.1 soNumeros: deixa só os números de um texto ====
// Ex.: soNumeros("(11) 98765-4321")  ->  "11987654321"
function soNumeros(texto) {
  var resultado = "";                          // começa vazio e vou juntando
  // ---- 1.1.1 percorrer o texto letra por letra ----
  for (var i = 0; i < texto.length; i++) {     // length = quantos caracteres o texto tem
    var letra = texto.charAt(i);               // charAt(i) pega o caractere da posição i
    // ---- 1.1.2 conferir se a letra é um dígito ----
    // indexOf devolve a posição onde achou. Se não achou, devolve -1.
    // Então "!= -1" quer dizer "achou, é um número".
    if ("0123456789".indexOf(letra) != -1) {
      resultado = resultado + letra;
    }
  }
  return resultado;
}

// ==== 1.2 soLetras: deixa só letras, espaço, apóstrofo e hífen ====
// Uso no campo de nome, pra ninguém digitar número no nome.
function soLetras(texto) {
  var resultado = "";
  for (var i = 0; i < texto.length; i++) {
    var letra = texto.charAt(i);
    // Truque que eu aprendi: uma LETRA muda quando vira maiúscula/minúscula
    // ("a" vira "A"), mas número e símbolo não mudam. Então:
    // se maiúscula é diferente de minúscula -> é letra.
    if (letra.toUpperCase() != letra.toLowerCase() || letra == " " || letra == "'" || letra == "-") {
      resultado = resultado + letra;
    }
  }
  return resultado;
}

// ==== 1.3 tirarSeparadores: tira os símbolos | e # ====
// Eu uso | e # pra separar os dados dentro do localStorage (ver site.js),
// então eles NÃO podem aparecer no texto que a pessoa digita. Se aparecessem,
// bagunçavam tudo na hora de separar com split.
function tirarSeparadores(texto) {
  // split corta o texto toda vez que acha o símbolo e join cola de volta sem ele.
  // É o jeito de "trocar todos" usando só split + join.
  texto = texto.split("|").join("");
  texto = texto.split("#").join("");
  return texto;
}


// ======================================================================
// 2. MÁSCARAS (rodam no evento oninput = enquanto a pessoa digita)
// ======================================================================
// Todas recebem o "campo" (o <input>). No HTML eu chamo assim:
//   <input oninput="mascaraCPF(this)">   <- o "this" é o próprio campo

// ==== 2.1 Campos de texto ====

// ---- 2.1.1 nome: só letras ----
function mascaraNome(campo) {
  campo.value = soLetras(campo.value);
}

// ---- 2.1.2 e-mail: sem espaço e sem | ou # ----
function mascaraEmail(campo) {
  campo.value = tirarSeparadores(campo.value.split(" ").join(""));
}

// ---- 2.1.3 endereço: sem | ou # ----
function mascaraEndereco(campo) {
  campo.value = tirarSeparadores(campo.value);
}

// ==== 2.2 Campos numéricos ====

// ---- 2.2.1 número simples (ex.: número da casa): só aceita número ----
function mascaraNumero(campo) {
  campo.value = soNumeros(campo.value);
}

// ---- 2.2.2 CPF: 000.000.000-00 ----
function mascaraCPF(campo) {
  // valueOf devolve o valor (o texto) que está no campo
  var texto = campo.value.valueOf();
  // pego só os números e uso slice(0, 11) pra limitar em 11 dígitos
  var n = soNumeros(texto).slice(0, 11);
  var r = n;
  // Vou montando conforme a pessoa digita. substring(a, b) pega do a até antes do b.
  if (n.length > 9) {
    r = n.substring(0, 3) + "." + n.substring(3, 6) + "." + n.substring(6, 9) + "-" + n.substring(9);
  } else if (n.length > 6) {
    r = n.substring(0, 3) + "." + n.substring(3, 6) + "." + n.substring(6);
  } else if (n.length > 3) {
    r = n.substring(0, 3) + "." + n.substring(3);
  }
  campo.value = r;
}

// ---- 2.2.3 telefone: (00) 00000-0000 ----
function mascaraTelefone(campo) {
  var n = soNumeros(campo.value).slice(0, 11);   // DDD + 9 dígitos = 11 no máximo
  var r = n;
  if (n.length > 10) {                           // celular: (11) 98765-4321
    r = "(" + n.substring(0, 2) + ") " + n.substring(2, 7) + "-" + n.substring(7);
  } else if (n.length > 6) {                     // fixo: (11) 9876-5432
    r = "(" + n.substring(0, 2) + ") " + n.substring(2, 6) + "-" + n.substring(6);
  } else if (n.length > 2) {
    r = "(" + n.substring(0, 2) + ") " + n.substring(2);
  } else if (n.length > 0) {
    r = "(" + n;
  }
  campo.value = r;
}

// ---- 2.2.4 CEP: 00000-000 ----
function mascaraCEP(campo) {
  var n = soNumeros(campo.value).slice(0, 8);    // CEP tem 8 números
  if (n.length > 5) {
    n = n.substring(0, 5) + "-" + n.substring(5);
  }
  campo.value = n;
}

// ---- 2.2.5 data: 00/00/0000 ----
function mascaraData(campo) {
  var n = soNumeros(campo.value).slice(0, 8);    // dia(2) + mês(2) + ano(4)
  var r = n;
  if (n.length > 4) {
    r = n.substring(0, 2) + "/" + n.substring(2, 4) + "/" + n.substring(4);
  } else if (n.length > 2) {
    r = n.substring(0, 2) + "/" + n.substring(2);
  }
  campo.value = r;
}


// ======================================================================
// 3. VALIDAÇÕES (conferem se o que a pessoa digitou faz sentido)
// ======================================================================

// ==== 3.1 validarCPF: confere os dígitos verificadores ====
// Devolve true (CPF válido) ou false (inválido).
function validarCPF(cpf) {
  var n = soNumeros(cpf);
  // ---- 3.1.1 tem que ter 11 números ----
  if (n.length != 11) { return false; }
  // ---- 3.1.2 CPF com todos os números iguais (111.111.111-11) não existe ----
  var iguais = true;
  for (var i = 1; i < 11; i++) {
    if (n.charAt(i) != n.charAt(0)) { iguais = false; }
  }
  if (iguais) { return false; }
  // ---- 3.1.3 cálculo dos 2 últimos dígitos (posições 9 e 10) ----
  // Essa conta é a regra oficial do CPF. t = 9 calcula o 1º dígito e t = 10 o 2º.
  for (var t = 9; t < 11; t++) {
    var soma = 0;
    for (var j = 0; j < t; j++) {
      // Number() transforma o texto "5" no número 5 pra poder multiplicar
      soma = soma + Number(n.charAt(j)) * (t + 1 - j);
    }
    var resto = (soma * 10) % 11;                // % = resto da divisão
    if (resto == 10) { resto = 0; }
    if (resto != Number(n.charAt(t))) { return false; }
  }
  return true;
}

// ==== 3.2 validarData: confere se a data existe ====
function validarData(texto) {
  // split("/") corta "15/03/2005" em ["15", "03", "2005"]
  var partes = texto.split("/");
  if (partes.length != 3 || partes[2].length != 4) { return false; }
  var dia = Number(partes[0]);
  var mes = Number(partes[1]);
  var ano = Number(partes[2]);
  var anoAtual = new Date().getFullYear();       // pega o ano de hoje
  if (ano < 1900 || ano > anoAtual || mes < 1 || mes > 12 || dia < 1) { return false; }
  // quantos dias tem cada mês (fevereiro = 28, mas ano bissexto = 29)
  var diasDoMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if ((ano % 4 == 0 && ano % 100 != 0) || ano % 400 == 0) { diasDoMes[1] = 29; }
  return dia <= diasDoMes[mes - 1];
}

// ==== 3.3 emailValido: confere o formato do e-mail ====
function emailValido(email) {
  var arroba = email.search("@");                // search devolve a posição do @ (ou -1)
  var ultimoPonto = email.lastIndexOf(".");      // lastIndexOf = posição do ÚLTIMO ponto
  if (arroba < 1) { return false; }              // tem que ter algo antes do @
  if (email.indexOf("@") != email.lastIndexOf("@")) { return false; }   // só pode ter 1 @
  if (ultimoPonto < arroba + 2) { return false; }                       // o ponto vem depois do @
  if (ultimoPonto > email.length - 3) { return false; }                 // precisa de 2+ letras depois do ponto
  return true;
}

// ==== 3.4 checar: escolhe a validação pelo "tipo" ====
// Devolve a mensagem de erro, ou "" (vazio) quando está tudo certo.
function checar(tipo, valor) {

  // ---- 3.4.1 nome: precisa de nome + sobrenome ----
  if (tipo == "nome") {
    var palavras = valor.split(" ");             // separa as palavras pelo espaço
    var quantas = 0;
    for (var i = 0; i < palavras.length; i++) {
      if (palavras[i].length > 1) { quantas = quantas + 1; }
    }
    if (quantas < 2) { return "Informe nome e sobrenome (só letras)."; }
  }

  // ---- 3.4.2 campos que usam as funções de cima ----
  if (tipo == "email" && !emailValido(valor)) { return "Informe um e-mail válido."; }
  if (tipo == "cpf" && !validarCPF(valor)) { return "CPF inválido."; }
  if (tipo == "data" && !validarData(valor)) { return "Data inválida. Use dd/mm/aaaa."; }

  // ---- 3.4.3 telefone: 10 (fixo) ou 11 (celular) números ----
  if (tipo == "tel") {
    var qtd = soNumeros(valor).length;
    if (qtd != 10 && qtd != 11) { return "Telefone inválido. Use DDD + número."; }
  }

  // ---- 3.4.4 cep, número e endereço ----
  if (tipo == "cep" && soNumeros(valor).length != 8) { return "O CEP precisa ter 8 números."; }
  if (tipo == "numero" && soNumeros(valor).length < 1) { return "Informe o número."; }
  if (tipo == "endereco" && valor.length < 5) { return "Informe o endereço completo."; }

  // ---- 3.4.5 senha: 8+ caracteres, com letra e número ----
  if (tipo == "senha") {
    var temLetra = false;
    for (var k = 0; k < valor.length; k++) {
      if (valor.charAt(k).toUpperCase() != valor.charAt(k).toLowerCase()) { temLetra = true; }
    }
    var temNumero = soNumeros(valor).length > 0;
    if (valor.length < 8 || !temLetra || !temNumero) { return "Mínimo de 8 caracteres, com letras e números."; }
    // | e # são os separadores do localStorage, então não deixo usar na senha
    if (valor.indexOf("|") != -1 || valor.indexOf("#") != -1) { return "A senha não pode ter os símbolos | ou #."; }
  }

  // ---- 3.4.6 campo obrigatório (não pode ficar vazio) ----
  if (tipo == "obrigatorio" && valor.length == 0) { return "Preencha este campo."; }

  return "";   // nenhum erro encontrado
}


// ======================================================================
// 4. EVENTOS DOS CAMPOS (onfocus, onblur, onselect, onreset...)
// ======================================================================

// ==== 4.1 destacar: evento onfocus (o campo ganhou o cursor) ====
// Deixo a borda dourada pra pessoa ver qual campo está preenchendo.
function destacar(campo) {
  campo.style.borderColor = "#d4af35";
}

// ==== 4.2 validarCampo: evento onblur (o campo perdeu o cursor) ====
// Quando a pessoa sai do campo eu valido e mostro o erro embaixo dele.
// Devolve true se estiver certo e false se tiver erro.
function validarCampo(campo, tipo) {
  campo.style.borderColor = "";                  // tira o dourado do onfocus
  var mensagem = checar(tipo, campo.value);
  // Cada campo tem um <span id="erro-NOMEDOCAMPO"> embaixo pra mostrar a mensagem
  var spanErro = document.getElementById("erro-" + campo.id);
  if (spanErro != null) { spanErro.innerHTML = mensagem; }
  if (mensagem == "") {
    campo.classList.remove("invalid");           // classe "invalid" deixa a borda vermelha
    return true;
  }
  campo.classList.add("invalid");
  return false;
}

// ==== 4.3 validarLista: valida vários campos de uma vez ====
// Usado no onsubmit dos formulários. ids e tipos são arrays na mesma ordem.
// Ex.: validarLista(["cpf", "tel"], ["cpf", "tel"])
function validarLista(ids, tipos) {
  var tudoCerto = true;
  var primeiroErro = null;
  for (var i = 0; i < ids.length; i++) {
    var campo = document.getElementById(ids[i]);
    if (!validarCampo(campo, tipos[i])) {
      tudoCerto = false;
      if (primeiroErro == null) { primeiroErro = campo; }   // guardo o 1º campo errado
    }
  }
  if (primeiroErro != null) { primeiroErro.focus(); }       // coloco o cursor nele
  return tudoCerto;
}

// ==== 4.4 mostrarSelecao: evento onselect ====
// Acontece quando a pessoa seleciona (marca) um pedaço do texto do campo.
// Só mostro no console (F12) o que foi selecionado.
function mostrarSelecao(campo) {
  var selecionado = campo.value.substring(campo.selectionStart, campo.selectionEnd);
  console.log("Texto selecionado: " + selecionado);
}

// ==== 4.5 contarCaracteres: contador do textarea (oninput) ====
// Mostra "12/200" embaixo da caixa de observações.
function contarCaracteres(campo, idContador) {
  document.getElementById(idContador).innerHTML = campo.value.length + "/" + campo.maxLength;
}

// ==== 4.6 limparErros: apaga as mensagens de erro (usado no onreset) ====
function limparErros(ids) {
  for (var i = 0; i < ids.length; i++) {
    var campo = document.getElementById(ids[i]);
    campo.classList.remove("invalid");
    campo.style.borderColor = "";
    var spanErro = document.getElementById("erro-" + ids[i]);
    if (spanErro != null) { spanErro.innerHTML = ""; }
  }
}

// ==== 4.7 mostrarSenha: botão "Mostrar/Ocultar" ====
function mostrarSenha(id, botao) {
  var campo = document.getElementById(id);
  // type="password" esconde as letras; trocando pra "text" elas aparecem
  if (campo.type == "password") {
    campo.type = "text";
    botao.innerHTML = "Ocultar";
  } else {
    campo.type = "password";
    botao.innerHTML = "Mostrar";
  }
}
