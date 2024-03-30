'use strict';

const hitBtn = document.querySelector('#blackjack-hit-button');
const standBtn = document.querySelector('#blackjack-stand-button');
const dealBtn = document.querySelector('#blackjack-deal-button');
const message = document.querySelector('#Blackjack-result');

let blackJackGame = {
  you: {
    scoreSpan: '#your-blackjack-result',
    div: '#yourbox',
    score: 0,
    who: 'You',
  },
  dealer: {
    scoreSpan: '#dealer-blackjack-result',
    div: '#dealer-box',
    score: 0,
    who: 'Dealer',
  },
  cards: [2, 3, 4, 5, 6, 7, 8, 10, 'K', 'J', 'Q', 'A'],
  wins: 0,
  loses: 0,
  draws: 0,
  isStand: false,
  turnOver: false,
};

const YOU = blackJackGame.you;
const DEALER = blackJackGame.dealer;

const blackJackHit = function (e) {
  if (!blackJackGame.isStand) {
    let card = randomCard();
    showCard(card, YOU);
    updateScore(card, YOU);
  }
};

const randomCard = function () {
  let randomIndex = Math.trunc(Math.random() * 13);
  return blackJackGame.cards[randomIndex];
};

const updateScore = function (card, activePlayer) {
  activePlayer[0] = 0;
  if (card == 'A') {
    card = [1, 11];
    if (activePlayer.score + card[1] <= 21) {
      activePlayer.score += card[1];
    } else {
      activePlayer.score += card[0];
    }
  } else if (+card) {
    activePlayer.score += card;
    document.querySelector(activePlayer.scoreSpan).textContent =
      activePlayer.score;
  } else if (card == 'K' || card == 'J' || card == 'Q') {
    card = 10;
    activePlayer.score += card;
    document.querySelector(activePlayer.scoreSpan).textContent =
      activePlayer.score;
  }

  if (activePlayer.score > 21) {
    document.querySelector(activePlayer.scoreSpan).textContent = 'BUST!';
    document.querySelector(activePlayer.scoreSpan).style.color = 'Red';
  } else {
    document.querySelector(activePlayer.scoreSpan).textContent =
      activePlayer.score;
  }
};

const showCard = function (card, activePlayer) {
  if (activePlayer.score <= 21) {
    let cardImg = document.createElement('img');
    cardImg.src = `img/${card}.jpg`;
    document.querySelector(activePlayer.div).appendChild(cardImg);
  }
};

hitBtn.addEventListener('click', blackJackHit);

const blackJackDeal = function (activePlayer) {
  // showResult(computeWinner())
  if (blackJackGame.turnOver === true) {
    blackJackGame.isStand = false;
    let yourImage = document.querySelector('#yourbox').querySelectorAll('img');
    let dealerImg = document
      .querySelector('#dealer-box')
      .querySelectorAll('img');

    yourImage.forEach(img => img.remove());
    dealerImg.forEach(img => img.remove());

    YOU.score = 0;
    DEALER.score = 0;

    document.querySelector('#your-blackjack-result').textContent = 0;
    document.querySelector('#dealer-blackjack-result').textContent = 0;

    document.querySelector('#your-blackjack-result').style.color = 'white';
    document.querySelector('#dealer-blackjack-result').style.color = 'white';

    document.querySelector('#Blackjack-result').textContent = `Let's Play`;
    document.querySelector('#Blackjack-result').style.color = 'black';

    blackJackGame.turnOver = true;
  }
};

const sleep = function (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

async function dealerLogic() {
  blackJackGame.isStand = true;

  while (DEALER.score < 16 && blackJackGame.isStand === true) {
    let card = randomCard();
    showCard(card, DEALER);
    updateScore(card, DEALER);
    await sleep(1000);
  }

  blackJackGame.turnOver = true;
  let winner = computeWinner();
  showResult(winner);
}

standBtn.addEventListener('click', dealerLogic);

dealBtn.addEventListener('click', blackJackDeal);

// compute winner and return who just won

const computeWinner = function () {
  let winner;
  if (YOU.score <= 21) {
    if (YOU.score > DEALER.score || DEALER.score > 21) {
      blackJackGame.wins++;
      winner = YOU;
    } else if (YOU.score < DEALER.score) {
      blackJackGame.loses++;
      winner = DEALER;
    } else if (YOU.score === DEALER.score) {
      blackJackGame.draws++;
    }
  } else if (YOU.score > 21 && DEALER.score <= 21) {
    blackJackGame.loses++;
    winner = DEALER;
  } else if (YOU.score > 21 && DEALER.score > 21) {
    blackJackGame.draws++;
  }
  return winner;
};

const showResult = function (winner) {
  let message, messageColor;
  if (blackJackGame.turnOver === true) {
    if (winner === YOU) {
      message = 'You won!🎉';
      messageColor = 'green';
      document.querySelector('#wins').textContent = blackJackGame.wins;
    } else if (winner === DEALER) {
      message = 'You lost!🤡😂';
      messageColor = 'red';
      document.querySelector('#loses').textContent = blackJackGame.loses;
    } else {
      message = 'You tied!🥱';
      messageColor = 'blue';
      document.querySelector('#draws').textContent = blackJackGame.draws;
    }

    document.querySelector('#Blackjack-result').textContent = message;
    document.querySelector('#Blackjack-result').style.color = messageColor;
  }
};


