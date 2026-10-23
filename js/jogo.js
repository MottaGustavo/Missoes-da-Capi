// ============================================================
// Missões da Capi - lógica do jogo
// As perguntas NÃO ficam mais aqui: estão no index.html, uma <section class="pergunta"> para cada.
// Este arquivo só lê o HTML e faz funcionar (telas, arrastar, pontuação, áudio).
// ============================================================

const $ = seletor => document.querySelector(seletor);
const FASES = ['facil', 'media', 'dificil'];          // fase-facil, fase-media, fase-dificil (fundo da tela)
const ELEMENTOS = 'assets/img/elementos/';

const MENSAGENS_ACERTO = ['Muito bem!', 'Isso mesmo!', 'Você acertou!', 'Que legal!', 'Parabéns!'];
const MENSAGENS_ERRO = [
    'Quase! Você consegue, eu acredito em você!',
    'Essa não era a resposta, mas está tudo bem! Vamos tentar de novo?',
    'Não foi dessa vez, mas você está indo muito bem! Tente de novo!',
    'Tudo bem errar. Eu sei que você consegue!'
];

// ---------- elementos fixos do HTML ----------
const telaInicio = $('#tela-inicio');
const telaCadastro = $('#tela-cadastro');
const telasMissao = [...document.querySelectorAll('.tela-missao')];
const telaJogo = $('#tela-jogo');
const cabecalho = $('#cabecalho');
const resultado = $('#resultado');
const perguntas = [...document.querySelectorAll('.pergunta')];

// ---------- estado do jogo ----------
let jogador = {};          // nome, idade, escola
let indice = 0;            // pergunta atual (0 a 19)
let estrelas = 0;
let ocupado = false;       // true enquanto mostra acerto/erro (bloqueia toques)
let textoFalado = '';      // o que o botão "ouvir de novo" repete
let idAudio = '';          // nome do mp3 em assets/audio (sem .mp3)
let audioAtual = null;
let area = null;           // .area-pergunta da pergunta que está na tela

// Cópia limpa da área de cada pergunta: ao abrir a pergunta (ou jogar de novo) ela começa do zero.
const modelos = new Map(perguntas.map(p => [p, p.querySelector('.area-pergunta').cloneNode(true)]));

// ---------- utilidades ----------
const embaralhar = lista => [...lista].sort(() => Math.random() - .5);
const sortear = lista => lista[Math.floor(Math.random() * lista.length)];
const missaoDa = pergunta => Number(pergunta.dataset.missao) - 1;   // data-missao vai de 1 a 3; aqui usamos 0 a 2

// troca emoji do texto por desenho SVG (assets/emoji), para aparecer igual em qualquer navegador
const emoji = texto => String(texto).replace(/\p{Extended_Pictographic}\uFE0F?/gu, m =>
    `<img class="desenho" alt="" draggable="false" src="assets/emoji/${m.replace('\uFE0F', '').codePointAt(0).toString(16)}.svg">`);

// ---------- texto dentro do balão de fala (reduz a fonte até caber) ----------
// o texto de cada balão é embrulhado num <span> para podermos medir
document.querySelectorAll('.balao-fala p').forEach(p => {
    const span = document.createElement('span');
    while (p.firstChild) span.appendChild(p.firstChild);
    p.appendChild(span);
});
function ajustarTexto(p) {
    const span = p.firstElementChild;
    if (!span) return;
    let tamanho = p.parentElement.classList.contains('grande') ? 24 : 20;
    p.style.fontSize = tamanho + 'px';
    while (tamanho > 9 && (span.offsetHeight > p.clientHeight || span.scrollWidth > p.clientWidth)) {
        tamanho--;
        p.style.fontSize = tamanho + 'px';
    }
}
const ajustarBaloesVisiveis = () => document.querySelectorAll('.balao-fala p').forEach(p => p.offsetParent && ajustarTexto(p));
addEventListener('resize', ajustarBaloesVisiveis);

// ---------- áudio ----------
// Toca assets/audio/<id>.mp3 e, se o arquivo não existir, usa a voz do navegador.
function falarComVoz(texto) {
    try {
        speechSynthesis.cancel();
        const fala = new SpeechSynthesisUtterance(texto);
        fala.lang = 'pt-BR';
        fala.rate = .8;
        fala.pitch = 1.3;
        speechSynthesis.speak(fala);
    } catch (e) { }
}
function falar(texto, id) {
    try { speechSynthesis.cancel(); } catch (e) { }
    if (audioAtual) { audioAtual.pause(); audioAtual = null; }
    if (!id) return falarComVoz(texto);
    const audio = audioAtual = new Audio(`assets/audio/${id}.mp3`);
    audio.onerror = () => { if (audioAtual === audio) falarComVoz(texto); };
    try {
        const promessa = audio.play();
        promessa && promessa.catch && promessa.catch(() => { });
    } catch (e) { }
}
document.addEventListener('dragstart', e => e.preventDefault());

// botões "ouvir de novo" (introdução e perguntas)
document.querySelectorAll('.botao-som-balao').forEach(b => b.onclick = () => falar(textoFalado, idAudio));

// ---------- trocar de tela ----------
function mostrarTela(tela) {
    [telaInicio, telaCadastro, ...telasMissao, telaJogo].forEach(t => t.hidden = t !== tela);
    if (tela === telaInicio || tela === telaCadastro) document.body.className = '';
    ajustarBaloesVisiveis();
}

// ---------- resultado (cartão "Isso mesmo!", "Tente de novo", fim) ----------
function mostrarResultado(titulo, textoBotao, aoClicar, poseCapi) {
    resultado.querySelector('.capi-resultado').src = `assets/img/capi/${poseCapi}.webp`;
    resultado.querySelector('h2').innerHTML = emoji(titulo);
    const botao = $('#botao-continuar');
    botao.textContent = textoBotao;
    resultado.hidden = false;
    botao.onclick = () => { resultado.hidden = true; aoClicar(); };
}

function acertar(mensagem, tempo) {
    if (ocupado) return;
    ocupado = true;
    area.classList.add('acertou');
    const n = Math.floor(Math.random() * MENSAGENS_ACERTO.length);
    const texto = MENSAGENS_ACERTO[n];
    falar(texto, 'acerto-' + (n + 1));
    setTimeout(() => {
        ocupado = false;
        area.classList.remove('acertou');
        estrelas++;
        indice++;
        const mudouDeMissao = indice < perguntas.length && missaoDa(perguntas[indice]) !== missaoDa(perguntas[indice - 1]);
        mostrarResultado(texto + (mensagem ? '<br>' + mensagem : '') + ' ⭐', 'Continuar',
            () => mudouDeMissao ? abrirMissao(missaoDa(perguntas[indice])) : abrirPergunta(), 'pulando');
    }, tempo || 1500);
}

function errar() {
    if (ocupado) return;
    ocupado = true;
    area.classList.add('errou');
    setTimeout(() => {
        ocupado = false;
        area.classList.remove('errou');
        document.querySelectorAll('.opcao.errou').forEach(o => o.classList.remove('errou'));
        const n = Math.floor(Math.random() * MENSAGENS_ERRO.length);
        const texto = MENSAGENS_ERRO[n];
        mostrarResultado(texto + ' 💪', 'Tentar de novo', () => { }, sortear(['pensando', 'sentada']));
        falar(texto, 'erro-' + (n + 1));
    }, 1300);
}

function fimDoJogo() {
    const nome = jogador.nome ? ', ' + jogador.nome : '';
    mostrarResultado(`Parabéns${nome}! 🎉<br>Você completou todas as missões e ganhou ${estrelas} estrelas!`, 'Jogar de novo',
        () => { indice = 0; estrelas = 0; abrirMissao(0); }, 'pulando');
    falar('Parabéns! Você completou todas as missões!', 'fim');
}

// ---------- missões e perguntas ----------
function abrirMissao(n) {
    document.body.className = 'fase-' + FASES[n];
    const tela = telasMissao[n];
    // "Oi, Nome!" - o nome da criança entra no <span class="nome-crianca">
    tela.querySelectorAll('.nome-crianca').forEach(s => s.textContent = jogador.nome ? ', ' + jogador.nome : '');
    mostrarTela(tela);
    textoFalado = tela.querySelector('.fala-missao').textContent;
    idAudio = tela.id.replace('tela-missao-', 'missao-');          // tela-missao-1 -> missao-1.mp3
    falar(textoFalado, idAudio);
}

function abrirPergunta() {
    if (indice >= perguntas.length) return fimDoJogo();
    const pergunta = perguntas[indice];
    document.body.className = 'fase-' + FASES[missaoDa(pergunta)];

    // só a pergunta atual aparece; a área volta ao estado original
    perguntas.forEach(p => p.hidden = p !== pergunta);
    area = modelos.get(pergunta).cloneNode(true);
    pergunta.querySelector('.area-pergunta').replaceWith(area);

    cabecalho.innerHTML = `<b>Missão ${missaoDa(pergunta) + 1}</b><span>${indice + 1}/${perguntas.length}</span><span>${emoji('⭐')} ${estrelas}</span>`;
    mostrarTela(telaJogo);

    const som = area.querySelector('.botao-som');
    textoFalado = pergunta.querySelector('.fala').textContent + (som ? ' ' + som.dataset.som : '');
    idAudio = pergunta.id.replace('pergunta-', 'q');                // pergunta-05 -> q05.mp3

    TIPOS[pergunta.dataset.tipo](pergunta);
    falar(textoFalado, idAudio);
}

// coloca a peça numa posição da cena: posicao = "x,y,modo,valor"
// modo u = atrás da imagem (embaixo da mesa); modo c = esconde a parte de baixo (dentro da caixa/cesta)
function posicionar(peca, posicao, destino, travar) {
    const [x, y, modo, valor] = posicao.split(',');
    destino.appendChild(peca);
    peca.style.cssText += `;position:absolute;left:${x}%;top:${y}%;transform:translate(-50%,-50%)${travar ? ';pointer-events:none' : ''}`;
    peca.style.zIndex = modo === 'u' ? 0 : 2;
    peca.style.clipPath = modo === 'c' ? `inset(0 0 ${valor}% 0)` : '';
}

// ============================================================
// Os tipos de pergunta (data-tipo na <section>)
// ============================================================
const TIPOS = {

    // Escolher uma opção. A certa é a que tem data-numero igual ao data-resposta da pergunta.
    escolha(pergunta) {
        const linha = area.querySelector('.linha');
        embaralhar(linha.children).forEach(opcao => linha.appendChild(opcao));
        const botaoSom = area.querySelector('.botao-som');
        if (botaoSom) botaoSom.onclick = () => falar(botaoSom.dataset.som, 'som-' + idAudio);
        area.querySelectorAll('.opcao').forEach(opcao => opcao.onclick = () => {
            if (ocupado) return;
            const certa = Number(opcao.dataset.numero) === Number(pergunta.dataset.resposta);
            opcao.classList.add(certa ? 'acertou' : 'errou');
            if (certa) area.querySelector('.figura-grande')?.classList.remove('cinza');
            certa ? acertar() : errar();
        });
    },

    // Estourar os balões da cor data-alvo.
    'estourar-baloes'(pergunta) {
        const linha = area.querySelector('.linha');
        embaralhar(linha.children).forEach(balao => linha.appendChild(balao));
        let faltam = [...area.querySelectorAll('.balao-festa')].filter(b => b.dataset.cor === pergunta.dataset.alvo).length;
        area.querySelectorAll('.balao-festa').forEach(balao => balao.onclick = () => {
            if (ocupado || balao.classList.contains('estourado')) return;
            if (balao.dataset.cor === pergunta.dataset.alvo) {
                balao.classList.add('estourado');
                if (!--faltam) acertar();
            } else errar();
        });
    },

    // Bater nos blocos com a picareta (cada bloco tem 5 batidas); um deles, sorteado, tem o diamante.
    blocos() {
        const blocos = [...area.querySelectorAll('.bloco')];
        const sorteado = Math.floor(Math.random() * blocos.length);
        const batidasRestantes = blocos.map(() => 5);
        blocos.forEach((bloco, k) => bloco.onclick = () => {
            if (batidasRestantes[k] <= 0 || ocupado) return;
            batidasRestantes[k]--;
            const batidas = 5 - batidasRestantes[k];
            falar(['um', 'dois', 'três', 'quatro', 'cinco'][batidas - 1], 'conta-' + batidas);
            const picareta = bloco.querySelector('.picareta');
            picareta.classList.remove('golpe');
            void picareta.offsetWidth;                                 // reinicia a animação
            picareta.classList.add('golpe');
            setTimeout(() => {
                bloco.classList.add('tremendo');
                setTimeout(() => bloco.classList.remove('tremendo'), 250);
                bloco.querySelector('b').textContent = batidasRestantes[k] || '';
                const imagem = bloco.querySelector('.imagem-bloco');
                if (k === sorteado && batidasRestantes[k] === 3) imagem.src = ELEMENTOS + 'pedra-estagio2.webp';
                if (!batidasRestantes[k]) {
                    if (k === sorteado) {
                        imagem.src = ELEMENTOS + 'diamante.webp';
                        bloco.classList.add('piscando');
                        acertar('Você achou o diamante!', 2600);
                    } else {
                        bloco.classList.add('sumiu');
                        falar('Aqui não tinha nada. Tente outro bloco!', 'bloco-vazio');
                    }
                }
            }, 200);
        });
    },

    // Raspar a tela até aparecer o objeto escondido (posição sorteada a cada vez).
    raspar(pergunta) {
        const x = (Math.random() < .5 ? .2 : .7) + Math.random() * .1;
        const y = (Math.random() < .5 ? .25 : .65) + Math.random() * .1;
        const objeto = area.querySelector('.objeto-escondido');
        objeto.style.left = x * 100 + '%';
        objeto.style.top = y * 100 + '%';
        const limite = Number(pergunta.dataset.limite) || .45;
        const tela = area.querySelector('.tela-raspar');
        const pincel = tela.getContext('2d');
        pincel.fillStyle = '#9aa5b1';
        pincel.fillRect(0, 0, 420, 280);
        pincel.globalCompositeOperation = 'destination-out';
        tela.onpointermove = e => {
            if (!e.buttons) return;
            const r = tela.getBoundingClientRect();
            pincel.beginPath();
            pincel.arc((e.clientX - r.left) * 420 / r.width, (e.clientY - r.top) * 280 / r.height, 26, 0, 7);
            pincel.fill();
        };
        tela.onpointerup = () => {
            const raio = 70;
            const pixels = pincel.getImageData(x * 420 - raio, y * 280 - raio, 2 * raio, 2 * raio).data;
            let limpos = 0;
            for (let k = 3; k < pixels.length; k += 4) if (!pixels[k]) limpos++;
            if (limpos > 4 * raio * raio * limite) {
                tela.style.transition = 'opacity .6s';
                tela.style.opacity = 0;
                acertar('Achamos!', 2400);
            }
        };
    },

    // Cofre: digitar a senha (data-senha) no teclado.
    cofre(pergunta) {
        const senha = pergunta.dataset.senha;
        const visor = area.querySelector('.senha-cofre');
        let digitado = '';
        const atualizar = () => visor.innerHTML = emoji('🔒') + ' ' + Array.from({ length: senha.length }, (_, k) => digitado[k] || '_').join(' ');
        atualizar();
        area.querySelectorAll('.teclado .botao').forEach(tecla => tecla.onclick = () => {
            if (ocupado) return;
            const digito = tecla.dataset.digito;
            if (digito === '←') digitado = digitado.slice(0, -1);
            else if (digito === 'OK') {
                if (digitado === senha) {
                    visor.innerHTML = emoji('🔓') + ' ' + digitado;
                    return acertar('O cofre abriu!');
                }
                digitado = '';
                atualizar();
                return errar();
            } else if (digitado.length < senha.length) digitado += digito;
            atualizar();
        });
    },

    // Arrastar cada .peca até o .destino certo (data-destino da peça = data-nome do destino).
    arrastar(pergunta) {
        const emSequencia = pergunta.hasAttribute('data-sequencia');   // peças aparecem uma de cada vez
        const bandeja = area.querySelector('.bandeja');
        const figuraFinal = area.querySelector('.robo-pronto');
        let faltam = area.querySelectorAll('.peca').length;
        const destinoDe = nome => area.querySelector(`.destino[data-nome="${nome}"]`);

        if (!emSequencia) embaralhar(bandeja.children).forEach(peca => bandeja.appendChild(peca));

        // peça que já começa dentro de uma cena (data-comeca-em)
        area.querySelectorAll('.peca[data-comeca-em]').forEach(peca => {
            const zona = destinoDe(peca.dataset.comecaEm);
            posicionar(peca, zona.dataset.posicao, zona.parentElement);
        });

        // destaca (pisca) o lugar da próxima peça, nas perguntas em sequência
        const dica = () => {
            area.querySelectorAll('.dica').forEach(x => x.classList.remove('dica'));
            if (!emSequencia) return;
            const atual = bandeja.querySelector('.peca:not(.escondida)');
            if (atual) destinoDe(atual.dataset.destino)?.classList.add('dica');
        };
        dica();

        area.querySelectorAll('.peca').forEach(peca => {
            let inicioX, inicioY, arrastando = false, zSalvo, recorteSalvo;

            const soltar = () => {
                if (!arrastando) return;
                arrastando = false;
                peca.classList.remove('arrastando');
                peca.style.zIndex = zSalvo;
                peca.style.clipPath = recorteSalvo;
                // acha o destino que mais cobre a peça
                const r = peca.getBoundingClientRect();
                let alvo = null, maiorArea = 0;
                area.querySelectorAll('.destino').forEach(d => {
                    const rd = d.getBoundingClientRect();
                    const largura = Math.min(r.right, rd.right) - Math.max(r.left, rd.left);
                    const altura = Math.min(r.bottom, rd.bottom) - Math.max(r.top, rd.top);
                    if (largura > 0 && altura > 0 && largura * altura > maiorArea) { maiorArea = largura * altura; alvo = d; }
                });
                peca.style.transform = peca.dataset.comecaEm ? 'translate(-50%,-50%)' : '';
                if (!alvo || maiorArea < r.width * r.height * .25 || ocupado) return;
                if (peca.dataset.comecaEm === alvo.dataset.nome) return;          // soltou onde já estava
                if (alvo.dataset.nome !== peca.dataset.destino) return errar();

                const posicao = peca.dataset.posicao || alvo.dataset.posicao;
                if (posicao) posicionar(peca, posicao, alvo.classList.contains('area-cena') ? alvo.parentElement : alvo, true);
                else { alvo.appendChild(peca); peca.classList.add('encaixada'); }

                if (emSequencia) {
                    bandeja.querySelector('.peca.escondida')?.classList.remove('escondida');
                    dica();
                }
                if (!--faltam) {
                    if (figuraFinal) {
                        // ex.: robô montado - mostra a figura inteira antes de dar o parabéns
                        setTimeout(() => {
                            figuraFinal.previousElementSibling.hidden = true;
                            figuraFinal.hidden = false;
                            acertar(pergunta.dataset.mensagem, 3000);
                        }, 900);
                    } else acertar(pergunta.dataset.mensagem);
                }
            };

            peca.onpointerdown = e => {
                if (arrastando || ocupado) return;
                e.preventDefault();
                arrastando = true;
                inicioX = e.clientX;
                inicioY = e.clientY;
                zSalvo = peca.style.zIndex;
                recorteSalvo = peca.style.clipPath;
                peca.style.zIndex = 9;
                peca.style.clipPath = '';
                peca.setPointerCapture(e.pointerId);
                peca.classList.add('arrastando');
            };
            peca.onpointermove = e => {
                if (!arrastando) return;
                const dx = e.clientX - inicioX, dy = e.clientY - inicioY;
                peca.style.transform = peca.dataset.comecaEm
                    ? `translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px))`
                    : `translate(${dx}px,${dy}px)`;
            };
            peca.onpointerup = soltar;
            peca.onpointercancel = soltar;
        });
    }
};

// ---------- botões das telas iniciais ----------
$('#botao-jogar').onclick = () => mostrarTela(telaCadastro);
$('#botao-comecar').onclick = () => {
    jogador = { nome: $('#campo-nome').value.trim(), idade: $('#campo-idade').value, escola: $('#campo-escola').value.trim() };
    indice = 0;
    estrelas = 0;
    abrirMissao(0);
};
document.querySelectorAll('.botao-vamos').forEach(b => b.onclick = abrirPergunta);
