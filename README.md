# Missões da Capi

Jogo web educativo para crianças do Pré-escolar II (5 a 6 anos). HTML, CSS e JavaScript puros, sem instalação.

## Como abrir
Dê dois cliques em `index.html` (Chrome, Firefox ou Edge). Para publicar: GitHub Pages apontando para a raiz do repositório.

## Estrutura
- `js/questoes.js`: as 60 perguntas (20 por missão). Para usar uma imagem de `assets/img/elementos`, escreva `{nome-do-arquivo}`.
- `js/jogo.js`: telas, mecânicas e pontuação.
- `css/estilo.css`: visual.
- `assets/img/capi`, `assets/img/elementos`, `assets/img/fundos`: imagens WebP, nomes minúsculos e sem acento (o GitHub Pages diferencia maiúsculas).
- `assets/img/fundos/*-desktop.webp`: 1672×941 (mantenha 16:9 e pelo menos 1600 px de largura para ficar nítido em telas grandes).
- Zonas das cenas em `questoes.js` (objeto `S`): `[esq%, topo%, larg%, alt%, x%, y%, modo, valor]`. Modo `'u'` coloca o item atrás da imagem (embaixo da mesa); `'c'` esconde `valor`% da parte de baixo do item (dentro da caixa/cesta).
- `assets/emoji`: desenhos padrão (Twemoji) usados quando falta imagem.
- Ícone do áudio: salve `assets/img/elementos/audio.webp` para trocar o padrão.

## Créditos
Desenhos padrão: Twemoji, © Twitter/jdecked, licença CC-BY 4.0 (https://github.com/jdecked/twemoji).
