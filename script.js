// =========================================================
// FASE 6 — Reflexo em cascata + faíscas douradas
// =========================================================

const convite = document.querySelector(".convite");
const textosDourados = document.querySelectorAll(".dourado");
const areasDeFaisca = document.querySelectorAll("[data-faisca]");
const poucoMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// 1) Cada texto recebe um atraso maior que o anterior:
//    o reflexo desce pelo convite, de cima para baixo.
textosDourados.forEach((texto, indice) => {
  texto.style.setProperty("--atraso", `${indice * 0.35}s`);
});

// 2) Cria uma faísca em um ponto sorteado dentro de um elemento
function criarFaisca(alvo) {
  const caixaConvite = convite.getBoundingClientRect();
  const caixaAlvo = alvo.getBoundingClientRect();

  // posição sorteada dentro do alvo, convertida para coordenadas do convite
  const x = caixaAlvo.left - caixaConvite.left + Math.random() * caixaAlvo.width;
  const y = caixaAlvo.top - caixaConvite.top + Math.random() * caixaAlvo.height;

  // tamanho proporcional ao convite (entre 1,8% e 3,4% da largura)
  const tamanho = caixaConvite.width * (0.018 + Math.random() * 0.016);

  const faisca = document.createElement("span");
  faisca.className = "faisca";
  faisca.style.left = `${x}px`;
  faisca.style.top = `${y}px`;
  faisca.style.setProperty("--tamanho", `${tamanho}px`);

  convite.appendChild(faisca);

  // quando a animação termina, a faísca sai da página (não acumula elementos)
  faisca.addEventListener("animationend", () => faisca.remove());
}

// 3) A cada 350 ms, uma faísca aparece em uma área sorteada
if (!poucoMovimento && areasDeFaisca.length > 0) {
  setInterval(() => {
    const sorteio = Math.floor(Math.random() * areasDeFaisca.length);
    criarFaisca(areasDeFaisca[sorteio]);
  }, 350);
}

// =========================================================
// FASE 7 — Tela cheia ao tocar/clicar no convite
// =========================================================

// Alguns navegadores (Safari antigo) usam nomes com o prefixo "webkit"
const telaCheiaSuportada = document.fullscreenEnabled || document.webkitFullscreenEnabled;

function estaEmTelaCheia() {
  return Boolean(document.fullscreenElement || document.webkitFullscreenElement);
}

function alternarTelaCheia() {
  const pagina = document.documentElement;   // a página inteira (<html>)

  const resultado = estaEmTelaCheia()
    ? (document.exitFullscreen || document.webkitExitFullscreen).call(document)
    : (pagina.requestFullscreen || pagina.webkitRequestFullscreen).call(pagina);

  // a versão moderna devolve uma Promise; se o navegador recusar, apenas ignoramos
  if (resultado && resultado.catch) {
    resultado.catch(() => {});
  }
}

// Só ativa (e só mostra a dica) onde a tela cheia funciona — no iPhone não aparece nada
if (telaCheiaSuportada) {
  document.addEventListener("click", alternarTelaCheia);

  const dica = document.createElement("p");
  dica.className = "dica-tela-cheia";
  dica.textContent = "Toque no convite para ver em tela cheia";
  document.body.appendChild(dica);

  // a dica some sozinha depois de 4 segundos, ou assim que entrar em tela cheia
  setTimeout(() => dica.classList.add("sumir"), 4000);
  document.addEventListener("fullscreenchange", () => dica.classList.add("sumir"));
}
