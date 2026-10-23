// n = missão (0 fácil, 1 média, 2 difícil) | ar = área | h = habilidade | k = tipo de tela
// Imagens: {nome} = arquivo assets/img/elementos/nome.webp
const A = { s: 'Sons e Sílabas', e: 'Noções de Espaço', m: 'Matemática Simples', v: 'Percepção Visual e Sensorial' };
const C = { vermelho: '#e63946', azul: '#3a86ff', verde: '#2dbe60', roxo: '#8e44ad', amarelo: '#ffd60a', laranja: '#ff9f1c', cinza: '#9aa5b1', marrom: '#8d5524', branco: '#ffffff' };
// cada cena tem zonas invisíveis: [esquerda%, topo%, largura%, altura%, ponto x%, ponto y% onde o item fica]
const S = { mesa: { i: 'mesa-de-madeira', z: { c: [8, 0, 84, 40, 50, 30], b: [22, 62, 56, 38, 30, 74, 'u'] } }, caixa: { i: 'caixa-de-papelao', z: { d: [10, 32, 80, 64, 50, 43, 'c', 38] } }, cesta: { i: 'cesta-de-palha', z: { d: [10, 30, 80, 66, 50, 57, 'c', 20] } }, casa: { i: 'casa-de-cachorro', z: { d: [28, 52, 44, 46, 50, 76] } }, prato: { i: 'prato-branco', z: { p: [0, 15, 100, 85, 50, 60] } } };
const cor = (e, a, c, d) => ({ n: 0, ar: 'v', h: 'Cores', k: 'ch', p: `De que cor é ${a}? Toque na cor certa.`, big: `{${e}}`, gr: 1, o: [c, ...d].map(x => ({ c: C[x] })), a: 0 });
const par = l => ({ n: 0, ar: 'v', h: 'Cores', k: 'dr', p: 'Leve cada um para a sua cor.', t: l.map(([, c]) => ({ id: c, c: C[c], z: 84 })), i: l.map(([e, c]) => ({ e: `{${e}}`, to: c, s: 72 })) });
const dif = (o, a) => ({ n: 0, ar: 'v', h: 'Percepção visual', k: 'ch', p: 'Qual é diferente?', o: o.map(e => ({ e: `{${e}}` })), a });
const bal = (c, b, all) => ({ n: 0, ar: 'v', h: 'Cores', k: 'bl', p: all ? `Estoure todos os balões ${c}s!` : `Estoure o balão ${c}!`, cor: c, b });
const som = (n, o, t) => ({ n, ar: 's', h: 'Compreensão auditiva', k: 'ch', p: 'Qual bichinho faz assim?', snd: t, o: o.map(e => ({ e: `{${e}}` })), a: 0 });
const sil = (e, w, t, a) => ({ n: 1, ar: 's', h: 'Consciência silábica', k: 'ch', p: `Quantas sílabas tem a palavra ${w}?`, big: `{${e}}`, tx: w, snd: t, o: [1, 2, 3].map(x => ({ t: '' + x })), a, ns: 1 });
const col = (n, p, sc, i) => ({ n, ar: 'e', h: 'Dentro, fora, em cima e embaixo', k: 'dr', p, sc, sw: n ? 180 : 0, i: i.map(([e, to]) => ({ e: `{${e}}`, to, s: /\.[bd]$/.test(to) ? 44 : 56 })) });
const somb = l => ({ n: 1, ar: 'v', h: 'Percepção visual', k: 'dr', p: 'Leve cada figura para a sombra dela.', t: l.map(e => ({ id: e, e: `{${e}}`, sh: 1, z: 84 })), i: l.map(e => ({ e: `{${e}}`, to: e, s: 84 })) });
const blo = nb => ({ n: 1, ar: 'e', h: 'Raciocínio e atenção', k: 'bk', p: 'Bata nos blocos com a picareta até achar o diamante!', nb });
const ras = (o, nome, th) => ({ n: 1, ar: 'e', h: 'Localização', k: 'rs', p: `Raspe a tela e encontre ${nome}!`, o, th });
const dep = (big, o) => ({ n: 2, ar: 'm', h: 'Padrões', k: 'ch', p: 'Qual vem depois?', big, o: o.map(e => ({ e })), a: 0 });
const hab = l => ({ n: 2, ar: 'v', h: 'Animais e habitats', k: 'dr', p: 'Leve cada bichinho para o lugar onde ele mora.', t: l.map(([, h]) => ({ id: h, e: `{habitat-${h}}`, z: 110, rd: 1 })), i: l.map(([a, h]) => ({ e: `{${a}}`, to: h, s: 64 })) });
const cof = c => ({ n: 2, ar: 'm', h: 'Números', k: 'sf', p: 'Descubra a senha do cofre. Cada papel mostra um número!', code: c });
const ord = l => ({ n: 2, ar: 'm', h: 'Grandezas e comparações', k: 'dr', p: 'Coloque do menor para o maior.', t: [1, 2, 3].map(k => ({ id: '' + k, l: k + 'º', z: 40 })), i: l.map((e, k) => ({ e: `{${e}}`, to: '' + (k + 1), s: 80 })) });
const mais = (e, x, y) => ({ n: 2, ar: 'm', h: 'Quantidades', k: 'ch', p: 'Qual grupo tem mais?', o: [x, y].map(n => ({ e: `{${e}}`.repeat(n) })), a: 0, sm: 1 });
const rob = (id, e, at) => ({ id, e: `{robo-${e}}`, at });
const L = (n, x) => ({ ...x, n });
const Q = [
    cor('banana', 'a banana', 'amarelo', ['roxo', 'azul']),
    bal('azul', ['azul', 'verde', 'roxo', 'vermelho', 'verde', 'roxo']),
    som(0, ['cachorro', 'gato', 'vaca'], 'Au au au!'),
    dif(['gato', 'gato', 'gato', 'cachorro'], 3),
    col(0, 'Coloque a bola em cima da mesa.', ['mesa'], [['bola', 'mesa.c']]),
    L(0, mais('maca', 5, 3)),
    L(1, par([['sapo', 'verde'], ['lagosta', 'vermelho'], ['peixe', 'azul']])),
    L(1, bal('vermelho', ['vermelho', 'azul', 'vermelho', 'verde', 'vermelho', 'roxo'], 1)),
    somb(['gato', 'elefante', 'peixe']),
    L(1, hab([['peixe', 'mar'], ['macaco', 'selva'], ['sapo', 'rio']])),
    { n: 1, ar: 'e', h: 'Em cima, embaixo e dentro', k: 'dr', seq: 1, sw: 180, sc: ['mesa', 'caixa'], p: 'Tire a bola de baixo da mesa e coloque na caixa. Depois coloque o gato embaixo da mesa.', i: [{ e: '{bola}', to: 'caixa.d', s: 44, pre: 'mesa.b' }, { e: '{gato}', to: 'mesa.b', s: 44 }] },
    ras('capi/sentada', 'a Capi', .45),
    L(1, mais('banana', 7, 5)),
    dep('{balao-vermelho}{balao-azul}{balao-verde}{balao-vermelho}{balao-azul}❓', ['{balao-verde}', '{balao-roxo}', '{balao-vermelho}']),
    hab([['elefante', 'savana'], ['arara', 'selva'], ['lagosta', 'mar']]),
    {
        n: 2, ar: 'v', h: 'Montar e sequência', k: 'dr', grid: 1, seq: 1, fin: '{robo-inteiro}', w: 'Robô montado!', p: 'Vamos montar o robô! Coloque cada peça em cima da sombra dela.',
        t: [{ ...rob('c', 'cabeca', '1/2/2/4'), sh: 1, z: 84 }, { ...rob('be', 'braco-esquerdo', '2/1'), sh: 1, z: 84 }, { ...rob('t', 'torso', '2/2/3/4'), sh: 1, z: 84 }, { ...rob('bd', 'braco-direito', '2/4'), sh: 1, z: 84 }, { ...rob('pe', 'perna-esquerda', '3/2'), sh: 1, z: 84 }, { ...rob('pd', 'perna-direita', '3/3'), sh: 1, z: 84 }],
        i: [['c', 'cabeca'], ['t', 'torso'], ['be', 'braco-esquerdo'], ['bd', 'braco-direito'], ['pe', 'perna-esquerda'], ['pd', 'perna-direita']].map(([to, e]) => ({ e: `{robo-${e}}`, to, s: 84 }))
    },
    col(2, 'Coloque o gato embaixo da mesa, a banana dentro da cesta e a bola dentro da caixa.', ['mesa', 'caixa', 'cesta'], [['gato', 'mesa.b'], ['banana', 'cesta.d'], ['bola', 'caixa.d']]),
    { ...blo(5), n: 2, p: 'Bata nos blocos com a picareta e vamos contar juntos até achar o diamante!' },
    cof('139'),
    mais('balao-vermelho', 9, 7)];
