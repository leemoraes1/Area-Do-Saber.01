// Seleciona os elementos do DOM para manipulação
const cardBoard = document.querySelector("#cardboard");
const scoreElement = document.querySelector("#score");
const messageElement = document.querySelector("#message");
const restartBtn = document.querySelector("#restart-btn");

// Array de imagens para os cartões
const imgs = [
  "1.png",
  "2.png",
  "3.png",
  "4.png",
  "5.png",
  "6.png"
];

let cardHTML = "";

// Duplicar o array de imagens para criar pares de cartões
let cards = [...imgs, ...imgs];

// Função para embaralhar o array de cartões
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5); // Embaralha os elementos do array
}

// Função para criar e adicionar os cartões ao tabuleiro
function createCards() {
  cardHTML = ""; // Limpa o HTML atual
  // Embaralha o array de cartões
  cards = shuffle(cards);
  // Gerar o HTML para cada cartão
  cards.forEach(img => {
    cardHTML += `<div class="memory-card" data-card="${img}">
      <img class="front-face" src="img/${img}" alt="Card Front"/>
      <img class="back-face" src="img/tras.png" alt="Card Back">
    </div>`;
  });
  cardBoard.innerHTML = cardHTML; // Insere o HTML gerado no contêiner do tabuleiro
}

// Inicializa o jogo
let firstCard, secondCard; // Variáveis para armazenar os cartões virados
let lockCards = false; // Bloqueia a ação de virar cartões enquanto dois cartões estão virados
let score = 0; // Pontuação inicial

// Função para virar um cartão
function flipCard() {
  if (lockCards) return; // Se os cartões estão bloqueados, não faz nada
  if (this === firstCard) return; // Ignora o clique se o cartão clicado já for o primeiro cartão virado

  this.classList.add("flip"); // Adiciona a classe "flip" para virar o cartão

  if (!firstCard) {
    firstCard = this; // Armazena o primeiro cartão virado
    return;
  }

  secondCard = this; // Armazena o segundo cartão virado

  checkForMatch(); // Verifica se há uma correspondência entre os dois cartões
}

// Função para verificar se os dois cartões virados são uma correspondência
function checkForMatch() {
  let isMatch = firstCard.dataset.card === secondCard.dataset.card;

  if (isMatch) {
    updateScore(10); // Atualiza a pontuação por uma correspondência
    resetCards(isMatch); // Reseta o estado dos cartões
  } else {
    unFlipCards(); // Desvira os cartões que não correspondem
  }
}

// Função para desvirar os cartões que não correspondem
function unFlipCards() {
  lockCards = true; // Bloqueia a ação de virar cartões
  setTimeout(() => { // Aguarda 1 segundo antes de desvirar os cartões
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");

    resetCards(); // Reseta o estado dos cartões
  }, 1000);
}

// Função para resetar o estado dos cartões
function resetCards(isMatch = false) {
  if (isMatch) {
    // Se os cartões corresponderam, remove o evento de clique
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
  }

  // Limpa as variáveis e desbloqueia a ação de virar cartões
  [firstCard, secondCard, lockCards] = [null, null, false];

  // Verifica se o jogo acabou
  if (document.querySelectorAll(".memory-card:not(.flip)").length === 0) {
    setTimeout(() => {
      messageElement.textContent = "Parabéns! Você ganhou!"; // Exibe a mensagem de parabéns
    }, 500);
  }
}

// Função para atualizar a pontuação
function updateScore(points) {
  score += points; // Adiciona os pontos ao total
  scoreElement.textContent = `Pontuação: ${score}`; // Atualiza o elemento de pontuação
}

// Função para reiniciar o jogo
function restartGame() {
  score = 0; // Reseta a pontuação
  updateScore(0); // Atualiza o contador de pontos
  messageElement.textContent = ""; // Limpa a mensagem
  cards = shuffle([...imgs, ...imgs]); // Embaralha novamente as cartas
  createCards(); // Cria novas cartas
  // Adiciona o evento de clique para cada cartão
  const cardsElements = document.querySelectorAll(".memory-card");
  cardsElements.forEach(card => card.addEventListener("click", flipCard));
}

// Adiciona o evento de clique para reiniciar o jogo
restartBtn.addEventListener("click", restartGame);

// Inicializa o jogo ao carregar a página
createCards();
const cardsElements = document.querySelectorAll(".memory-card");
cardsElements.forEach(card => card.addEventListener("click", flipCard));
