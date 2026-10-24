# Missões da Capi

Jogo educativo para crianças de **5 a 6 anos**, feito para rodar direto no navegador (computador, tablet ou celular). A Capi acompanha a criança em três missões, fala cada pergunta em voz alta e comemora cada acerto.

O jogo funciona como uma ferramenta pedagógica de aprendizagem e de acompanhamento do desenvolvimento da criança, com uma experiência lúdica, interativa e adequada à realidade da Educação Infantil.

## Como funciona

1. A criança informa nome, idade e escola.
2. A Capi apresenta cada missão (Fácil, Média e Difícil).
3. A criança responde às perguntas tocando, arrastando ou raspando a tela.
4. Cada acerto vale uma estrela. Em caso de erro, a Capi incentiva a tentar de novo.
5. No fim, a criança vê quantas estrelas ganhou.

Todas as perguntas são faladas. Nenhuma depende de leitura.

## Áreas de aprendizagem

- Sons e Sílabas
- Noções de Espaço
- Matemática Simples
- Percepção Visual e Sensorial

Cada pergunta tem a área e a habilidade trabalhada registradas no HTML (`data-area` e `data-habilidade`).

## Tipos de atividade

| Tipo | Como a criança joga |
|---|---|
| Escolha | Toca na resposta certa |
| Estourar balões | Estoura os balões da cor pedida |
| Arrastar | Leva cada peça ao lugar certo |
| Raspar | Raspa a tela para achar a Capi |
| Blocos | Bate nos blocos com a picareta e conta até achar o diamante |
| Cofre | Descobre a senha e digita no teclado |

## Situação atual e planejamento

**Hoje o jogo tem 20 perguntas** distribuídas em 3 missões:

| Missão | Nível | Perguntas |
|---|---|---|
| 1 | Fácil | 6 |
| 2 | Médio | 7 |
| 3 | Difícil | 7 |

**Meta:** 60 perguntas, sendo 20 por nível, com 5 perguntas por área em cada nível:

- Sons e Sílabas: 5 perguntas
- Noções de Espaço: 5 perguntas
- Matemática Simples: 5 perguntas
- Percepção Visual e Sensorial: 5 perguntas

Os níveis Médio e Difícil seguem a mesma divisão do Fácil.

### Próximos passos

- Completar as perguntas de Sons e Sílabas (hoje há apenas 1).
- Chegar a 20 perguntas por nível.
- Salvar o desempenho das crianças (hoje nome, idade e escola não são guardados).

## Tecnologias

HTML, CSS e JavaScript puros, sem bibliotecas e sem etapa de instalação.

## Como rodar

Use um servidor local, como a extensão **Live Server** do VS Code, e abra `index.html`. Abrir o arquivo direto no navegador pode bloquear o carregamento de alguns recursos.

## Estrutura

```
index.html
css/style.css
js/jogo.js
assets/
  audio/    narração em mp3
  img/      capi, elementos e ícones
  emoji/    emojis em SVG
```

### Áudios

Ficam em `assets/audio`, em mp3, com nome em minúsculas. O jogo procura cada arquivo pelo nome. Se o arquivo não existir, ele usa a voz do navegador no lugar.

| Quando toca | Arquivos |
|---|---|
| Cada pergunta | `q01.mp3` até `q20.mp3` |
| Som do bichinho (pergunta 3) | `som-q03.mp3` |
| Início das missões | `missao-1.mp3`, `missao-2.mp3`, `missao-3.mp3` |
| Acerto | `acerto-1.mp3` até `acerto-5.mp3` |
| Erro | `erro-1.mp3` até `erro-4.mp3` |
| Fim do jogo | `fim.mp3` |
| Contagem da picareta | `conta-1.mp3` até `conta-5.mp3` |
| Bloco sem diamante | `bloco-vazio.mp3` |

Total: 40 arquivos.

## Créditos

- **Imagens:** todas geradas no ChatGPT.
- **Áudios:** gerados no ElevenLabs, com a voz **Hope**.
- **Emojis:** desenhos em SVG da pasta `assets/emoji`, usados em poucos pontos do jogo: 🔊 (ouvir de novo), ⭐ (estrelas), 🔒 e 🔓 (cofre), ❓ (padrões), 💪 (incentivo no erro) e 🎉 (fim do jogo). *(Confira e complete aqui o nome do conjunto de emojis usado, com a licença.)*