const $ = s => document.querySelector(s), st = $('#st');
// Ícone do áudio: coloque assets/img/elementos/audio.webp para trocar o padrão.
const IMG = { '🔊': 'elementos/audio.webp' };
const E = s => String(s).replace(/\{([a-z0-9-]+)\}/g, (m, n) => `<img class="em" alt="" draggable="false" src="assets/img/elementos/${n}.webp">`).replace(/\p{Extended_Pictographic}\uFE0F?/gu, m => { const e = m.replace('\uFE0F', ''), vg = `assets/emoji/${e.codePointAt(0).toString(16)}.svg`, f = IMG[e]; return f ? `<img class="em" alt="" draggable="false" src="assets/img/${f}" onerror="this.onerror=null;this.src='${vg}'">` : `<img class="em" alt="" draggable="false" src="${vg}">` });
const fit = p => { const s = p.firstElementChild; if (!s) return; let f = p.parentElement.classList.contains('l') ? 24 : 20; p.style.fontSize = f + 'px'; while (f > 9 && (s.offsetHeight > p.clientHeight || s.scrollWidth > p.clientWidth)) { f--; p.style.fontSize = f + 'px' } };
const setT = (p, t) => { p.innerHTML = ''; const s = document.createElement('span'); s.textContent = t; p.appendChild(s); fit(p) };
addEventListener('resize', () => document.querySelectorAll('.bub p').forEach(p => p.offsetParent && fit(p)));
// coloca o item numa zona da cena: a = 'x,y,modo,valor' (modo u = atrás da imagem, c = esconde a parte de baixo)
const put = (el, a, host, lock) => { const [x, y, m, v] = a.split(','); host.appendChild(el); el.style.cssText += `;position:absolute;left:${x}%;top:${y}%;transform:translate(-50%,-50%)${lock ? ';pointer-events:none' : ''}`; el.style.zIndex = m === 'u' ? 0 : 2; el.style.clipPath = m === 'c' ? `inset(0 0 ${v}% 0)` : '' };
const sh = a => [...a].sort(() => Math.random() - .5), pk = a => a[Math.floor(Math.random() * a.length)];
const OKS = ['Muito bem!', 'Isso mesmo!', 'Você acertou!', 'Que legal!', 'Parabéns!'];
const ERS = ['Quase! Você consegue, eu acredito em você!', 'Essa não era a resposta, mas está tudo bem! Vamos tentar de novo?', 'Não foi dessa vez, mas você está indo muito bem! Tente de novo!', 'Tudo bem errar. Eu sei que você consegue!'];
const LV = ['feliz', 'medio', 'dificil'];
let P = {}, i = 0, stars = 0, bz = 0, qt = '', qi = '', cur = null;
// Áudio: toca assets/audio/<id>.mp3 e, se o arquivo não existir, usa a voz do navegador.
const tts = t => { try { speechSynthesis.cancel(); const m = new SpeechSynthesisUtterance(t); m.lang = 'pt-BR'; m.rate = .8; m.pitch = 1.3; speechSynthesis.speak(m) } catch (e) { } };
const say = (t, id) => { try { speechSynthesis.cancel() } catch (e) { } if (cur) { cur.pause(); cur = null } if (!id) return tts(t); const a = cur = new Audio(`assets/audio/${id}.mp3`); a.onerror = () => { if (cur === a) tts(t) }; try { const p = a.play(); p && p.catch && p.catch(() => { }) } catch (e) { } };
document.addEventListener('dragstart', e => e.preventDefault());
const Y = {
  ch(q) {
    const o = q.ns ? q.o.map((x, k) => ({ ...x, k })) : sh(q.o.map((x, k) => ({ ...x, k })));
    st.innerHTML = (q.big ? `<div class="big${q.gr ? ' gr' : ''}">${E(q.big)}</div>` : '') + (q.tx ? `<div class="word">${q.tx}</div>` : '') + (q.snd ? `<button class="b" id="sn">${E('🔊')} Ouvir</button>` : '') + `<div class="row${q.sm ? ' sm' : ''}">` + o.map(x => `<button class="op${x.t ? ' t' : ''}" data-k="${x.k}" style="${x.c ? 'background:' + x.c + ';border-radius:50%' : ''}">${x.t || E(x.e || '')}</button>`).join('') + '</div>';
    if (q.snd) $('#sn').onclick = () => say(q.snd, 'som-' + qi);
    st.querySelectorAll('.op').forEach(b => b.onclick = () => { if (bz) return; const ok = +b.dataset.k === q.a; b.classList.add(ok ? 'yes' : 'no'); if (ok) $('.big')?.classList.remove('gr'); ok ? win() : lose() })
  },
  dr(q) {
    let n = q.i.length; const sc = (q.sc || []).map(x => [x, S[x]]);
    const tg = (q.t || []).map(t => `<div class="tg${t.sh ? ' sh' : ''}${t.rd ? ' rd' : ''}" data-id="${t.id}" style="${t.c ? 'background:' + t.c + ';' : ''}${t.at ? 'grid-area:' + t.at + ';' : ''}font-size:${t.z || 64}px">${t.e ? E(t.e) : t.l || ''}</div>`).join('');
    const sn = sc.map(([k, s]) => `<div class="scn"${q.sw ? ` style="width:${q.sw}px;height:${Math.round(q.sw * 1.3)}px"` : ''}><img src="assets/img/elementos/${s.i}.webp" alt="" draggable="false">${Object.entries(s.z).map(([z, a]) => `<div class="tg z" data-id="${k}.${z}" data-a="${a.slice(4).join(',')}" style="left:${a[0]}%;top:${a[1]}%;width:${a[2]}%;height:${a[3]}%"></div>`).join('')}</div>`).join('');
    const it = (q.seq ? q.i : sh(q.i)).map((x, k) => `<div class="it${q.seq && k ? ' hid' : ''}" data-to="${x.to}"${x.pre ? ` data-pre="${x.pre}"` : ''}${x.a ? ` data-a="${x.a}"` : ''} style="font-size:${x.s || 64}px">${E(x.e)}</div>`).join('');
    st.innerHTML = `<div class="${q.grid ? 'sd' : ''}"><div class="${q.grid ? 'rb' : 'row'}">${tg}${sn}</div><div class="row" id="tr">${it}</div></div>`;
    st.querySelectorAll('.it[data-pre]').forEach(el => { const z = st.querySelector(`.tg[data-id="${el.dataset.pre}"]`); put(el, z.dataset.a, z.parentElement) });
    const hint = () => { st.querySelectorAll('.hint').forEach(x => x.classList.remove('hint')); if (q.seq) { const c = st.querySelector('#tr .it:not(.hid)'); c && st.querySelector(`.tg[data-id="${c.dataset.to}"]`)?.classList.add('hint') } }; hint();
    st.querySelectorAll('.it').forEach(el => {
      let sx, sy, on = 0;
      const up = () => {
        if (!on) return; on = 0; el.classList.remove('dg'); el.style.zIndex = el.dataset.sz || ''; el.style.clipPath = el.dataset.sc || '';
        const R = el.getBoundingClientRect(); let t = null, bo = 0;
        st.querySelectorAll('.tg').forEach(g => { const r = g.getBoundingClientRect(), w = Math.min(R.right, r.right) - Math.max(R.left, r.left), h = Math.min(R.bottom, r.bottom) - Math.max(R.top, r.top); if (w > 0 && h > 0 && w * h > bo) { bo = w * h; t = g } });
        el.style.transform = el.dataset.pre ? 'translate(-50%,-50%)' : '';
        if (!t || bo < R.width * R.height * .25 || bz) return;
        if (el.dataset.pre === t.dataset.id) return;
        if (t.dataset.id !== el.dataset.to) return lose();
        const an = el.dataset.a || t.dataset.a;
        if (an) put(el, an, t.classList.contains('z') ? t.parentElement : t, 1)
        else { t.appendChild(el); el.classList.add('pl') }
        if (q.seq) { const nx = st.querySelector('#tr .it.hid'); nx && nx.classList.remove('hid'); hint() }
        if (!--n) { if (q.fin) setTimeout(() => { st.innerHTML = `<div class="big fin">${E(q.fin)}</div>`; win(q.w, 3000) }, 900); else win(q.w) }
      };
      el.onpointerdown = e => { if (on || bz) return; e.preventDefault(); on = 1; sx = e.clientX; sy = e.clientY; el.dataset.sz = el.style.zIndex; el.dataset.sc = el.style.clipPath; el.style.zIndex = 9; el.style.clipPath = ''; el.setPointerCapture(e.pointerId); el.classList.add('dg') };
      el.onpointermove = e => { if (on) { const dx = e.clientX - sx, dy = e.clientY - sy; el.style.transform = el.dataset.pre ? `translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px))` : `translate(${dx}px,${dy}px)` } };
      el.onpointerup = up; el.onpointercancel = up
    })
  },
  bl(q) {
    let n = q.b.filter(c => c === q.cor).length;
    st.innerHTML = '<div class="row">' + sh(q.b).map(c => `<img class="bal" data-c="${c}" src="assets/img/elementos/balao-${c}.webp" alt="" draggable="false">`).join('') + '</div>';
    st.querySelectorAll('.bal').forEach(b => b.onclick = () => { if (bz || b.classList.contains('pop')) return; if (b.dataset.c === q.cor) { b.classList.add('pop'); if (!--n) win() } else lose() })
  },
  bk(q) {
    const d = Math.floor(Math.random() * q.nb), n = Array(q.nb).fill(5), I = 'assets/img/elementos/';
    st.innerHTML = '<div class="row">' + n.map(() => `<div class="blk"><img class="bi" src="${I}pedra-estagio1.webp" alt="" draggable="false"><b>5</b><img class="pk" src="${I}picareta.webp" alt="" draggable="false"></div>`).join('') + '</div>';
    st.querySelectorAll('.blk').forEach((b, k) => b.onclick = () => {
      if (n[k] <= 0 || bz) return; n[k]--; const h = 5 - n[k]; say(['um', 'dois', 'três', 'quatro', 'cinco'][h - 1], 'conta-' + h); const p = b.querySelector('.pk'); p.classList.remove('hit'); void p.offsetWidth; p.classList.add('hit');
      setTimeout(() => {
        b.classList.add('sh'); setTimeout(() => b.classList.remove('sh'), 250); b.querySelector('b').textContent = n[k] || ''; const bi = b.querySelector('.bi');
        if (k === d && n[k] === 3) bi.src = I + 'pedra-estagio2.webp';
        if (!n[k]) { if (k === d) { bi.src = I + 'diamante.webp'; b.classList.add('pulse'); win('Você achou o diamante!', 2600) } else { b.classList.add('gone'); say('Aqui não tinha nada. Tente outro bloco!', 'bloco-vazio') } }
      }, 200)
    })
  },
  rs(q) {
    const px = (Math.random() < .5 ? .2 : .7) + Math.random() * .1, py = (Math.random() < .5 ? .25 : .65) + Math.random() * .1;
    st.innerHTML = `<div class="sw"><div id="oc"><img class="oi" src="assets/img/${q.o}.webp" alt="" draggable="false" style="left:${px * 100}%;top:${py * 100}%"></div><canvas id="cv" width="420" height="280"></canvas></div>`;
    const c = $('#cv'), x = c.getContext('2d'); x.fillStyle = '#9aa5b1'; x.fillRect(0, 0, 420, 280); x.globalCompositeOperation = 'destination-out';
    c.onpointermove = e => { if (!e.buttons) return; const r = c.getBoundingClientRect(); x.beginPath(); x.arc((e.clientX - r.left) * 420 / r.width, (e.clientY - r.top) * 280 / r.height, 26, 0, 7); x.fill() };
    c.onpointerup = () => { const s = 70, a = x.getImageData(px * 420 - s, py * 280 - s, 2 * s, 2 * s).data; let z = 0; for (let k = 3; k < a.length; k += 4)if (!a[k]) z++; if (z > 4 * s * s * (q.th || .45)) { c.style.transition = 'opacity .6s'; c.style.opacity = 0; win('Achamos!', 2400) } }
  },
  sf(q) {
    let v = ''; const L = q.code.length, up = () => $('#cf').innerHTML = E('🔒') + ' ' + Array.from({ length: L }, (_, k) => v[k] || '_').join(' ');
    st.innerHTML = '<div class="sd"><div class="sl"><div class="row">' + [...q.code].map((d, k) => `<div class="nt"><img src="assets/img/elementos/anotacao-papel.webp" alt="" draggable="false"><span>${[...q.code].map((_, j) => j === k ? d : '_').join(' ')}</span></div>`).join('') + '</div><div class="big" id="cf" style="font-size:44px"></div></div><div class="pad">' + [1, 2, 3, 4, 5, 6, 7, 8, 9, '←', 0, 'OK'].map(d => `<button class="b" data-d="${d}">${d}</button>`).join('') + '</div></div>'; up();
    st.querySelectorAll('.pad .b').forEach(b => b.onclick = () => { if (bz) return; const d = b.dataset.d; if (d === '←') v = v.slice(0, -1); else if (d === 'OK') { if (v === q.code) { $('#cf').innerHTML = E('🔓') + ' ' + v; return win('O cofre abriu!') } v = ''; up(); return lose() } else if (v.length < L) v += d; up() })
  },
  mm(q) {
    let a = null, m = 0, L = 0; const cv = b => { b.dataset.o = ''; b.innerHTML = E('❓') }, T = q.pr.length;
    st.innerHTML = '<div class="row" style="max-width:420px">' + sh([...q.pr, ...q.pr]).map(e => `<button class="op" data-e="${e}">${E('❓')}</button>`).join('') + '</div>';
    st.querySelectorAll('.op').forEach(b => b.onclick = () => {
      if (L || b.dataset.o || bz) return; b.dataset.o = 1; b.innerHTML = E(b.dataset.e); if (!a) { a = b; return }
      if (a.dataset.e === b.dataset.e) { a = null; if (++m === T) win() } else { L = 1; const x = a; a = null; setTimeout(() => { cv(x); cv(b); L = 0 }, 900) }
    })
  }
};
function ov(h, b, f, pz) { const o = $('#ov'); o.innerHTML = `<div class="c"><img class="mc" alt="" draggable="false" src="assets/img/capi/${pz}.webp"><h2>${E(h)}</h2><button class="b ok" id="ob">${b}</button></div>`; o.hidden = 0; $('#ob').onclick = () => { o.hidden = 1; f() } }
function win(m, ms) {
  if (bz) return; bz = 1; st.className = 'yes'; const k = Math.floor(Math.random() * OKS.length), t = OKS[k]; say(t, 'acerto-' + (k + 1));
  setTimeout(() => { bz = 0; st.className = ''; stars++; i++; const nl = i < Q.length && Q[i].n !== Q[i - 1].n; ov(t + (m ? '<br>' + m : '') + ' ⭐', 'Continuar', () => nl ? intro(Q[i].n) : go(), 'pulando') }, ms || 1500)
}
function lose() {
  if (bz) return; bz = 1; st.className = 'no';
  setTimeout(() => { bz = 0; st.className = ''; document.querySelectorAll('.op.no').forEach(x => x.classList.remove('no')); const k = Math.floor(Math.random() * ERS.length), t = ERS[k]; ov(t + ' 💪', 'Tentar de novo', () => { }, pk(['pensando', 'sentada'])); say(t, 'erro-' + (k + 1)) }, 1300)
}
function fim() { ov(`Parabéns${P.n ? ', ' + P.n : ''}! 🎉<br>Você completou todas as missões e ganhou ${stars} estrelas!`, 'Jogar de novo', () => { i = 0; stars = 0; intro(0) }, 'pulando'); say('Parabéns! Você completou todas as missões!', 'fim') }
const show = x => { ['s', 'l', 'v', 'g'].forEach(y => $('#' + y).hidden = y !== x); if (x === 's' || x === 'l') document.body.className = '' };
function intro(n) {
  document.body.className = 'n' + n; show('v'); $('#vc').src = `assets/img/capi/${LV[n]}.webp`;
  const t = [`${P.n ? 'Oi, ' + P.n + '! ' : 'Oi! '}Eu sou a Capi! Vamos começar a Missão 1? Eu vou te ajudar!`, 'Muito bem! Agora é a Missão 2! Vamos explorar juntos!', 'Chegamos na Missão 3, a última! Eu sei que você consegue!'][n];
  setT($('#vt'), t); $('#vb').textContent = 'Missão ' + (n + 1); qt = t; qi = 'missao-' + (n + 1); say(t, qi)
}
function go() {
  if (i >= Q.length) return fim(); const q = Q[i]; document.body.className = 'n' + q.n; show('g');
  $('#hd').innerHTML = `<b>Missão ${q.n + 1}</b><span>${i + 1}/${Q.length}</span><span>${E('⭐')} ${stars}</span>`;
  $('#cp').src = `assets/img/capi/${LV[q.n]}.webp`; setT($('#pt'), q.p); qi = 'q' + String(i + 1).padStart(2, '0'); qt = q.p + (q.snd ? ' ' + q.snd : ''); st.innerHTML = ''; Y[q.k](q); say(qt, qi)
}
document.querySelectorAll('.ico').forEach(b => { b.innerHTML = E('🔊'); b.onclick = () => say(qt, qi) });
$('#jg').onclick = () => show('l');
$('#go0').onclick = () => { P = { n: $('#nm').value.trim(), id: $('#id').value, es: $('#es').value.trim() }; i = 0; stars = 0; intro(0) };
$('#vg').onclick = go;
