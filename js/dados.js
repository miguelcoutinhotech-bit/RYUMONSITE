// ======================================================================
// RYŪMON  |  dados.js
// Aqui fica a lista de produtos do cardápio (o "banco de dados" fake).
// ----------------------------------------------------------------------
// COMO LER OS COMENTÁRIOS (pra quem for ler meu código):
//   // ====== 1. TÍTULO ======   -> nível 1 (parte grande do arquivo)
//   // ==== 1.1 Título ====      -> nível 2 (subparte)
//   // ---- 1.1.1 título ----    -> nível 3 (detalhe pequeno)
//   // texto normal             -> explicação do que eu fiz, em português
// ======================================================================


// ======================================================================
// 1. CATEGORIAS DO CARDÁPIO
// ======================================================================

// Isso aqui é um ARRAY DE ARRAYS (uma lista dentro de outra lista).
// Cada categoria tem 2 coisas: [código que o site usa, nome que aparece na tela]
// Tipo: categorias[1][0] = "sushi" e categorias[1][1] = "Sushi"
var categorias = [
  ["todos", "Todos"],
  ["sushi", "Sushi"],
  ["sashimi", "Sashimi"],
  ["uramaki", "Uramaki"],
  ["ramen", "Ramen"],
  ["tempura", "Tempurá"],
  ["sobremesa", "Sobremesas"],
  ["bebida", "Bebidas"]
];


// ======================================================================
// 2. PRODUTOS
// ======================================================================

// ARRAY DE OBJETOS: a lista "produtos" guarda vários objetos { }.
// Cada objeto é um prato e tem estas propriedades:
//   id    = número único do prato (usado no carrinho)
//   nome  = nome que aparece
//   desc  = descrição curta
//   preco = preço em número (com PONTO, não vírgula)
//   cat   = categoria (tem que ser igual a um código lá de cima)
//   kanji = letrinha japonesa que aparece no lugar da foto
//   pop   = posição no ranking de "mais pedidos" (1 = mais pedido)
// Pra pegar um dado: produtos[0].nome  ->  "Combo Nigiri 12 peças"
var produtos = [
  { id: 1,  nome: "Combo Nigiri 12 peças",  desc: "Salmão, atum e peixe branco.",        preco: 54.90,  cat: "sushi",     kanji: "寿司",   pop: 1 },
  { id: 2,  nome: "Sashimi de Salmão",      desc: "10 fatias de salmão fresco.",         preco: 42.90,  cat: "sashimi",   kanji: "刺身",   pop: 3 },
  { id: 3,  nome: "Uramaki Filadélfia",     desc: "8 peças com cream cheese.",           preco: 36.90,  cat: "uramaki",   kanji: "巻",     pop: 2 },
  { id: 4,  nome: "Shoyu Ramen",            desc: "Caldo de soja, chashu e ovo.",        preco: 44.90,  cat: "ramen",     kanji: "拉麺",   pop: 4 },
  { id: 5,  nome: "Tempurá Misto",          desc: "Camarão e legumes crocantes.",        preco: 39.90,  cat: "tempura",   kanji: "天ぷら", pop: 6 },
  { id: 6,  nome: "Gyoza (8 un.)",          desc: "Pasteizinhos grelhados de porco.",    preco: 29.90,  cat: "tempura",   kanji: "餃子",   pop: 5 },
  { id: 7,  nome: "Mochi de Matcha",        desc: "3 unidades, recheio cremoso.",        preco: 22.90,  cat: "sobremesa", kanji: "抹茶",   pop: 9 },
  { id: 8,  nome: "Chá Verde Gelado",       desc: "Sencha com toque cítrico.",           preco: 12.90,  cat: "bebida",    kanji: "茶",     pop: 12 },
  { id: 9,  nome: "Hot Roll Salmão",        desc: "Enrolado empanado e frito.",          preco: 38.90,  cat: "uramaki",   kanji: "炸",     pop: 7 },
  { id: 10, nome: "Temaki Salmão",          desc: "Cone de alga com salmão.",            preco: 27.90,  cat: "sushi",     kanji: "手巻",   pop: 8 },
  { id: 11, nome: "Combo Família 30 peças", desc: "Variedade para 3 a 4 pessoas.",       preco: 119.90, cat: "sushi",     kanji: "宴",     pop: 10 },
  { id: 12, nome: "Miso Ramen",             desc: "Caldo de missô, milho e manteiga.",   preco: 46.90,  cat: "ramen",     kanji: "味噌",   pop: 11 },
  { id: 13, nome: "Dorayaki",               desc: "Panquecas com doce de feijão azuki.", preco: 19.90,  cat: "sobremesa", kanji: "銅鑼",   pop: 13 },
  { id: 14, nome: "Refrigerante de Yuzu",   desc: "Cítrico japonês com gás.",            preco: 14.90,  cat: "bebida",    kanji: "柚子",   pop: 14 },
  { id: 15, nome: "Sashimi Misto",          desc: "Salmão, atum e polvo.",               preco: 58.90,  cat: "sashimi",   kanji: "盛",     pop: 15 }
];

// Pra adicionar um prato novo é só copiar uma linha, mudar o id (tem que ser
// diferente dos outros) e preencher o resto. O site inteiro se atualiza sozinho.
